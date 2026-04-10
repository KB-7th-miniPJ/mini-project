import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCategories, createExpense, getTravel } from "../api/expenseApi"; // ✅ getTravel 추가
 
// 혜성님 파일 생기면 주석 해제
// import { useMembersStore } from "@/stores/members";
 
export function useExpense() {
  // ✅ 라우트에서 travelId(숫자) 꺼내기
  // 라우트 경로: /travels/:travelId/expenses/new
  const route = useRoute();
  const travelNumId = route.params.travelId; // "1"
 
  // ✅ travel 정보 보관 (travelId 문자열 "travel1" 추출용)
  const travel = ref(null);
 
  // 혜성님 파일 생기면 주석 해제
  // const memberStore = useMembersStore();
 
  const categories = ref([]);
  const date = ref(new Date());
  const category = ref("");
  const amount = ref("");
  const place = ref("");
  const photos = ref([]);
 
  // 혜성님 파일 생기면 아래 주석 해제하고 임시 데이터 주석 처리
  // const members = computed(() => memberStore.participants);
  const members = ref([]);
 
  onMounted(async () => {
    try {
      // ✅ 카테고리 + 여행 정보 동시에 로드
      // getTravel, getCategories 둘 다 fetch 방식으로 통일
      const [catData, travelData] = await Promise.all([
        getCategories(),           // → [{ id:"c1", name:"교통", ... }]
        getTravel(travelNumId),    // → { id:1, travelId:"travel1", ... }
      ]);
 
      // 카테고리 세팅
      categories.value = catData;
      if (catData.length > 0) category.value = catData[0].name;
 

       
      // ✅ travel 세팅 → travel.travelId = "travel1" 확보
      travel.value = travelData;
  console.log('travel.travelId:', travel.value?.travelId)  // 확인용

    } catch (e) {
      console.error("데이터를 불러오지 못했습니다.", e);
    }
  });
 
  const formattedAmount = computed(() => {
    const num = amount.value.toString().replace(/[^0-9]/g, "");
    return num ? Number(num).toLocaleString() : "";
  });
 
  const perPerson = computed(() => {
    const totalMembers = members.value.length;
    if (totalMembers === 0) return "0";
    const totalAmount = Number(amount.value.toString().replace(/,/g, "")) || 0;
    return Math.floor(totalAmount / totalMembers).toLocaleString();
  });
 
  const setAmount = (val) => {
    amount.value = val.replace(/[^0-9]/g, "");
  };
 
  const saveExpense = async () => {
      console.log('저장할 travelId:', travel.value?.travelId)  // ← ✅추가
    const payload = {
      // ✅ travel 로드 완료 후 travelId 문자열 자동 포함
      // travel.value = { id:1, travelId:"travel1", ... }

      travelId: travel.value?.travelId ?? "",  // "travel1"
      date: date.value,
      category: category.value,
      place: place.value,
      amount: Number(amount.value.toString().replace(/,/g, "")),
 
      // 혜성님 파일 생기면 주석 해제
      // payer: memberStore.payer,
      // participants: memberStore.participants,
      payer: "",
      participants: members.value,
      photos: photos.value,
    };
  console.log('payload:', payload)  // ← 추가
    return await createExpense(payload);
  };
 
  return {
    categories, date, category, amount, place,
    formattedAmount, perPerson, members, photos,
    setAmount, saveExpense,
    travel, // 필요하면 template에서 travel?.title 등 사용 가능
  };
}
import { ref, computed, onMounted } from "vue";
import { getCategories, createExpense } from "../api/expenseApi";
// 혜성님 파일 생기면 주석 해제
// import { useMembersStore } from "@/stores/members"; 

export function useExpense() {
  // 혜성님 파일 생기면 주석 해제
  // const memberStore = useMembersStore();

  const categories = ref([]);
  const date = ref(new Date());
  const category = ref("");
  const amount = ref("");
  const place = ref(""); // 장소 추가
  const photos = ref([]);

  // 혜성님 파일 생기면 아래 주석 해제하고 임시 데이터 주석 처리
  // const members = computed(() => memberStore.participants);
  const members = ref([]);

  onMounted(async () => {
    try {
      const data = await getCategories();
      categories.value = data;
      if (data.length > 0) category.value = data[0].name;
    } catch (e) {
      console.error("카테고리를 불러오지 못했습니다.", e);
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
    const payload = {
      date: date.value,
      category: category.value,
      place: place.value,
      amount: Number(amount.value.toString().replace(/,/g, "")),
      // payer: memberStore.payer,               // 혜성님 파일 생기면 주석 해제
      // participants: memberStore.participants,  // 혜성님 파일 생기면 주석 해제
      payer: "",
      participants: members.value,
      photos: photos.value,
    };
    return await createExpense(payload);
  };

  return {
    categories, date, category, amount, place,
    formattedAmount, perPerson, members, photos,
    setAmount, saveExpense,
  };
}
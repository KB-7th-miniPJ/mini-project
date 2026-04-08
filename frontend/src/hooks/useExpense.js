// src/hooks/useExpense.js
import { ref, computed, onMounted } from "vue";
import { getCategories, createExpense } from "../api/expenseApi";

export function useExpense() {
  const categories = ref([]);
  const date = ref(new Date());
  const category = ref("");
  const amount = ref("");
  const members = ref([]); // 인원 선택 시 여기에 데이터가 담겨야 합니다.
  const photos = ref([]);

  // 카테고리 로드
  onMounted(async () => {
    try {
      const data = await getCategories();
      categories.value = data;
      // 기본값으로 첫 번째 카테고리 설정 (선택사항)
      if (data.length > 0) category.value = data[0].name;
    } catch (e) {
      console.error("카테고리를 불러오지 못했습니다.", e);
    }
  });

  // 실시간 콤마 포맷팅된 금액
  const formattedAmount = computed(() => {
    const num = amount.value.toString().replace(/[^0-9]/g, "");
    return num ? Number(num).toLocaleString() : "";
  });

  // 더치페이 계산 로직 (자동 계산)
  const perPerson = computed(() => {
    const totalMembers = members.value.length;
    if (totalMembers === 0) return "0";
    
    // amount에서 콤마 제거 후 숫자로 변환
    const totalAmount = Number(amount.value.toString().replace(/,/g, "")) || 0;
    return Math.floor(totalAmount / totalMembers).toLocaleString();
  });

  // 금액 입력 핸들러
  const setAmount = (val) => {
    const num = val.replace(/[^0-9]/g, "");
    // 입력값 저장 (더치페이 계산용)
    amount.value = num; 
  };

  const saveExpense = async () => {
    if (!category.value || !amount.value) return alert("데이터를 입력해주세요.");
    await createExpense({
      date: date.value,
      category: category.value,
      amount: Number(amount.value.replace(/,/g, "")),
      members: members.value,
      photos: photos.value,
    });
  };

  return {
    categories, date, category, amount,
    formattedAmount, perPerson, members, photos,
    setAmount, saveExpense,
  };
}
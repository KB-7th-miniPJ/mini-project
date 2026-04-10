import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getCategories, createExpense, getTravel } from "../api/expenseApi";

import { useMembersStore } from "@/stores/members";

export function useExpense() {
  const route = useRoute();
  const travelNumId = route.params.travelId;

  const travel = ref(null);

  const memberStore = useMembersStore();

  const categories = ref([]);
  const date = ref(new Date());
  const category = ref("");
  const amount = ref("");
  const place = ref("");
  const photos = ref([]);

  const members = computed(() => {
    console.log('members 데이터:', memberStore.participants)
    return memberStore.participants
  })

  onMounted(async () => {
    try {
      const [catData, travelData] = await Promise.all([
        getCategories(),
        getTravel(travelNumId),
      ]);

      categories.value = catData;
      if (catData.length > 0) category.value = catData[0].name;

      travel.value = travelData;
      console.log('travel.travelId:', travel.value?.travelId)

    } catch (e) {
      console.error("데이터를 불러오지 못했습니다.", e);
    }
  });

  const formattedAmount = computed(() => {
    const num = amount.value.toString().replace(/[^0-9]/g, "");
    return num ? Number(num).toLocaleString() : "";
  });

  // ✅ 잔돈 처리 포함한 perPerson
  const perPerson = computed(() => {
    const totalMembers = members.value.length;
    if (totalMembers === 0) return { amount: '0', remainder: 0, adjusted: '0' }
    const totalAmount = Number(amount.value.toString().replace(/,/g, "")) || 0;
    const remainder = totalAmount % totalMembers;
    const adjustedPerPerson = remainder > 0
      ? Math.ceil(totalAmount / totalMembers)
      : Math.floor(totalAmount / totalMembers);
    return {
      amount: Math.floor(totalAmount / totalMembers).toLocaleString(),
      remainder,
      adjusted: adjustedPerPerson.toLocaleString(),
    }
  });

  const setAmount = (val) => {
    amount.value = val.replace(/[^0-9]/g, "");
  };

  const saveExpense = async () => {
    console.log('저장할 travelId:', travel.value?.travelId)
    const payload = {
      travelId: travel.value?.travelId ?? "",
      date: date.value,
      category: category.value,
      place: place.value,
      amount: Number(amount.value.toString().replace(/,/g, "")),
      payer: "",
      participants: members.value,
      photos: photos.value,
    };
    console.log('payload:', payload)
    return await createExpense(payload);
  };

  return {
    categories, date, category, amount, place,
    formattedAmount, perPerson, members, photos,
    setAmount, saveExpense,
    travel,
  };
}
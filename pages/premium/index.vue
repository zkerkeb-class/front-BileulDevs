<template>
  <div class="container mx-auto px-5 py-8 max-w-7xl">
    <header class="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 md:mb-0">✨ Plans premium</h1>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div @click.prevent="buyPlan(plan)" v-for="plan in plans" :key="plan.name" :to="plan.to" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ plan.title }}</h2>
          <div class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            A partir de {{ formatTarif(plan.tarif) }}€
          </div>
        </div>
        <div class="flex justify-center my-6 text-sm text-center text-gray-500">
          {{ plan.description }}
        </div>
        <div class="flex justify-center my-6 text-sm text-center">
            {{ plan.subCount }} abonnés actifs sur ce plan
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const user = useAuth().user;

const { data: plans, error } = await useFetch(`${config.public.SERVICE_BDD_URL}/api/premium`);

//RENDRE DISABLE LES SUBSCRIPTION INFERIEUR A CELLE ACTUELLE + REDUIRE LE PRIX SIR SUB T2 ET VEUT T3 ETC


const planBody = ref({
    currency: "EUR"
})

const buyPlan = async (plan) => {
  try {
    const body = {
      ...planBody.value,
      amount: plan.tarif,
      productName: plan.title,
      userId: user.value.id,
      premiumId: plan.id
    };

    const { url } = await $fetch(`${config.public.SERVICE_PAY_URL}/api/pay/checkout`, {
      method: 'POST',
      body
    });

    window.open(url);

  } catch (error) {
    console.error('Erreur lors de l’achat du plan :', error);
    throw error;
  }
};


const formatTarif = (tarif) => {
  if (!Number.isInteger(tarif)) {
    throw new Error("Le paramètre doit être un entier.");
  }

  const format = tarif / 100;
  return format.toFixed(2);
}

</script>
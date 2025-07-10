<template>
  <div class="container mx-auto py-10 px-4 max-w-4xl">
    <div class="flex flex-col md:flex-row gap-8 mb-8">
      <!-- User Profile Section -->
      <div class="flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-8">Paramètres</h1>
        <div class="bg-gray-400 relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 mb-4">
          <span class="flex h-full w-full items-center justify-center rounded-full text-2xl bg-primary text-white">
            {{ userInitial }}
          </span>
        </div>
        <div class="text-center">
          <h2 class="text-xl font-semibold">{{ user.username }}</h2>
          <p class="text-sm text-muted-foreground mt-1">Inscrit depuis le</p>
          <p class="text-sm text-muted-foreground mt-1">{{ createdAt }}</p>
          <p class="text-muted-foreground mt-2">
            <UIAdminIcon v-if="auth.user.value.isAdmin" class="mx-auto" />
            <UIPremiumIcon v-if="auth.user.value.subscription" :sub="auth.user.value.subscription" class="mx-auto" />
          </p>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="flex-1">
        <div dir="ltr">
          <div role="tablist" class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-6">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              type="button" 
              role="tab" 
              :aria-selected="activeTab === tab.id" 
              :class="[
                'inline-flex items-center mr-2 justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                activeTab === tab.id ? 'bg-background text-foreground shadow-sm bg-indigo-500 text-white' : 'bg-white shadow-md'
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Personal Info Tab Content -->
          <div v-if="activeTab === 'personal'" class="mt-2">
            <div class="bg-white rounded-xl bg-card text-card-foreground shadow-md">
              <div class="flex flex-col space-y-1.5 p-6 ">
                <h3 class="font-semibold leading-none tracking-tight">Informations personnelles</h3>
                <p class="text-sm text-muted-foreground">Gérez vos informations personnelles et vos préférences de contact.</p>
              </div>
              <form @submit.prevent="updateUser">
                <div class="p-6 pt-0 space-y-4">
                  <!-- First Name -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="firstname">
                      Pseudo
                    </label>
                    <div class="relative">
                      <Icon name="lucide:user" class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10" 
                        id="firstname" 
                        v-model="formData.username" 
                        name="firstname"
                      />
                    </div>
                  </div>
                  
                  <!-- Email -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="email">
                      Email
                    </label>
                    <div class="relative">
                      <Icon name="lucide:mail" class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-16" 
                        id="email" 
                        type="email" 
                        v-model="auth.user.value.email" 
                        name="email"
                        disabled
                      />
                      <UIEmailVerified :verified="auth.user.value.isEmailVerified" />
                    </div>
                  </div>
                </div>
                
                <!-- Submit Button -->
                <div class="flex items-center p-6 pt-0 ">
                  <button 
                    class="bg-indigo-500 cursor-pointer text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2" 
                    type="submit"
                  >
                    <Icon name="lucide:save" class="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Security Tab Content -->
          <div v-if="activeTab === 'security'" class="mt-2">
            <div class="rounded-xl bg-white bg-card text-card-foreground shadow">
              <div class="flex flex-col space-y-1.5 p-6">
                <h3 class="font-semibold leading-none tracking-tight">Sécurité</h3>
                <p class="text-sm text-muted-foreground">Gérez vos paramètres de sécurité et vos options de connexion.</p>
              </div>
              <form @submit.prevent="updatePassword">
                <div class="p-6 pt-0 space-y-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="currentPassword">
                      Mot de passe actuel
                    </label>
                    <div class="relative">
                      <Icon name="lucide:key-round" class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10" 
                        id="currentPassword" 
                        v-model="formData.currentPassword" 
                        name="password"
                        placeholder="**********"
                        type="password"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="password">
                      Nouveau mot de passe
                    </label>
                    <div class="relative">
                      <Icon name="lucide:key-round" class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-16" 
                        id="password"
                        v-model="formData.password" 
                        name="passwordConfirmation"
                        type="password"
                        placeholder="**********"
                        required
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="passwordConfirmation">
                      Confirmation du nouveau mot de passe
                    </label>
                    <div class="relative">
                      <Icon name="lucide:key-round" class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        class="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-16" 
                        id="passwordConfirmation"
                        v-model="formData.passwordConfirmation" 
                        name="passwordConfirmation"
                        type="password"
                        placeholder="**********"
                        required
                      />
                    </div>
                  </div>
                  <p v-if="activeTab == 'security' && error" class="text-red-500 text-sm font-bold">{{ error }}</p>
                </div>

                
                <!-- Submit Button -->
                <div class="flex items-center p-6 pt-0 " v-if="activeTab == 'personal'">
                  <button 
                    class="bg-indigo-500 cursor-pointer text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2" 
                    type="submit"
                  >
                    <Icon name="lucide:save" class="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </button>
                </div>
                <div class="flex items-center p-6 pt-0 " v-if="activeTab == 'security'">
                  <button 
                    class="bg-indigo-500 cursor-pointer text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2" 
                    type="submit"
                  >
                    <Icon name="lucide:save" class="mr-2 h-4 w-4" />
                    Modifier mon mot de passe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const auth = useAuth()
const user = auth.user

const error = ref('');

const formData = reactive({
  username: user.value.username,
  email: user.value.email,
  currentPassword: '',
  password: '',
  passwordConfirmation: ''
});

watch(() => [formData.password, formData.passwordConfirmation], () => {
    if (error.value) {
      error.value = "";
    }
  }
);

const tabs = [
  { id: 'personal', label: 'Informations personnelles' },
  { id: 'security', label: 'Sécurité' }
];

const activeTab = ref('personal');

const userInitial = computed(() => {
  return user.value.username ? user.value.username.charAt(0).toUpperCase() : '';
})

const createdAt = computed(() => {
  const date = new Date(user.value.createdAt);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return new Intl.DateTimeFormat('fr-FR', options).format(date); 
})

const updateUser = async () => {
  try {
    const url = `${config.public.SERVICE_BDD_URL}/api/users/${auth.user.value.id}`
    
    const response = await $fetch(url, {
      method: 'PUT',
      body: { username: formData.username },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    //SWAL OK
  } catch (error) {
    //SWAL NON
    console.error('Erreur lors de la mise à jour du username:', error)
  }
}

const updatePassword = async () => {
  try {
    if(formData.password !== formData.passwordConfirmation) {
      error.value = "Les mots de passe ne sont pas identiques"
      return
    }

    if(!formData.currentPassword) {
      error.value = "Le mot de passe actuel est requis"
      return
    }

    if(!formData.password) {
      error.value = "Le nouveau mot de passe est requis"
      return
    }

    const url = `${config.public.SERVICE_BDD_URL}/api/users/${auth.user.value.id}`
    
    const response = await $fetch(url, {
      method: 'PUT',
      body: { 
        currentPassword: formData.currentPassword,
        password: formData.password,
        confirmPassword: formData.passwordConfirmation
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    formData.currentPassword = ''
    formData.password = ''
    formData.passwordConfirmation = ''
    error.value = ''

    //SWAL OK
    console.log('Mot de passe mis à jour avec succès')
    
  } catch (error) {
    if (error.data && error.data.message) {
      error.value = error.data.message
    } else {
      error.value = 'Erreur lors de la mise à jour du mot de passe'
    }
    
    //SWAL NON
    console.error('Erreur lors de la mise à jour du mot de passe:', error)
  }
}

</script>
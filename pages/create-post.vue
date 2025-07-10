<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="px-8 py-6">
          <h1 class="text-3xl font-bold">Créer un post</h1>
          <p class="font-thin text-gray-500 mt-2">Partagez votre passion automobile, montrez nous le photographe que vous êtes</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
          <!-- Marque et Modèle -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Marque *
              </label>
              <input
                v-model="formData.brand"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ex: BMW, Mercedes, Audi..."
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Modèle *
              </label>
              <input
                v-model="formData.model"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ex: Serie 3, Classe C, A4..."
                required
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Donnez nous votre avis, qu'en pensez vous..."
              required
            ></textarea>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div class="flex gap-2 mb-3">
              <input
                v-model="tagInput"
                type="text"
                @keypress="handleKeyPress"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ajouter un tag (ex: sportive, luxe, ancienne...)"
              />
              <button
                type="button"
                @click="addTag"
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Ajouter
              </button>
            </div>
            
            <!-- Tags list -->
            <div v-if="tagsList.length > 0" class="flex flex-wrap gap-2">
              <span v-for="tag in tagsList" :key="tag" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-indigo-800">
                {{ tag }}
                <button type="button" @click="removeTag(tag)" class="ml-2 text-blue-600 hover:text-blue-800 hover:cursor-pointer">
                  x
                </button>
              </span>
            </div>
          </div>

          <!-- Images Upload -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Images (maximum 6)
            </label>
            
            <!-- Upload Zone -->
            <div
              @dragenter="handleDrag"
              @dragleave="handleDrag"
              @dragover="handleDrag"
              @drop="handleDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <div class="space-y-4">
                <div class="text-4xl">📸</div>
                <div>
                  <p class="text-lg font-medium text-gray-700">
                    Glissez vos images ici
                  </p>
                  <p class="text-sm text-gray-500">ou</p>
                </div>
                <label class="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-medium">
                  Parcourir les fichiers
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleFileInput"
                    class="hidden"
                  />
                </label>
                <p class="text-xs text-gray-500">
                  PNG, JPG, GIF jusqu'à 10MB chacune
                </p>
              </div>
            </div>

            <!-- Image Preview -->
            <div v-if="previewImages.length > 0" class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="image in previewImages" :key="image.id" class="relative group">
                <NuxtImg :src="image.url" :alt="image.file.name" class="w-full h-32 object-cover rounded-lg border border-gray-200" />
                <div @click="removeImage(image.id)" class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center hover:cursor-pointer">
                    <Icon name="lucide:trash-2" />
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-6">
            <button
              type="submit"
              :disabled="!isFormValid || loading"
              :class="[
                'px-8 py-3 rounded-lg font-semibold transition-all',
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              Créer le post
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { fetching } = useFetching();

const formData = ref({
  brand: '',
  model: '',
  description: ''
})

const tagInput = ref('')
const tagsList = ref([])
const dragActive = ref(false)
const previewImages = ref([])
const loading = ref(false)

const isFormValid = computed(() => {
  return formData.value.brand && 
         formData.value.model && 
         formData.value.description
})

const addTag = () => {
  const cleanedTag = tagInput.value.trim().replace(/^#+/, '');
  if (cleanedTag && !tagsList.value.includes(cleanedTag)) {
    tagsList.value.push(cleanedTag);
    tagInput.value = '';
  }
}


const removeTag = (tagToRemove) => {
  tagsList.value = tagsList.value.filter(tag => tag !== tagToRemove)
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}

const handleDrag = (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === "dragenter" || e.type === "dragover") {
    dragActive.value = true
  } else if (e.type === "dragleave") {
    dragActive.value = false
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = false
  
  const files = Array.from(e.dataTransfer.files)
  handleFiles(files)
}

const handleFileInput = (e) => {
  const files = Array.from(e.target.files)
  handleFiles(files)
}

const handleFiles = (files) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  if (previewImages.value.length + imageFiles.length > 6) {
    //SWAL POPUP
    alert('Maximum 6 images autorisées')
    return
  }

  imageFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push({
        file: file,
        url: e.target.result,
        id: Date.now() + Math.random()
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (imageId) => {
  previewImages.value = previewImages.value.filter(img => img.id !== imageId)
}

const handleSubmit = async () => {
  const formDataToSend = new FormData()
  
  formDataToSend.append('brand', formData.value.brand)
  formDataToSend.append('model', formData.value.model)
  formDataToSend.append('description', formData.value.description)
  
  formDataToSend.append('tags', JSON.stringify(tagsList.value))
  
  previewImages.value.forEach((image, index) => {
    formDataToSend.append('image', image.file)
  })
  
  try {

    loading.value = true;

    const response = await fetching(`${config.public.SERVICE_AI_URL}/api/validate/validatePost`, { 
      method: 'POST',
      body: formDataToSend
    })
    
    
    // Reset du formulaire
    formData.value = { brand: '', model: '', description: '' }
    tagsList.value = []
    previewImages.value = []
    tagInput.value = ''
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
  } finally {
    loading.value = false;
  }
}
</script>
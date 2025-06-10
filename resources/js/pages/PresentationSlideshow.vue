<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Head } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap, 
  Wrench, 
  Code, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Coffee,
  Candy,
  Drill,
  Github,
  Save,
  FileText,
  Search,
  Ruler,
  RotateCw,
  MapPin,
  Zap,
  Settings,
  Cpu,
  Stars,
  Shield,
  PartyPopper,
  Lock,
  Lightbulb,
  Hash,
  Blocks,
  Puzzle
} from 'lucide-vue-next'

const { t } = useI18n()

// Icon mapping for pipeline steps
const stepIcons = [
  FileText,    // Step 1: Parse DXF
  Search,      // Step 2: Extract Drilling
  Ruler,       // Step 3: Translate Coords
  RotateCw,    // Step 4: Orient Workpiece
  MapPin,      // Step 5: Machine Position
  Zap,         // Step 6: Filter Operations
  Settings,    // Step 7: Group by Tool
  Cpu,         // Step 8: Generate G-code
  Stars,       // Step 9: Normalize Code
  Shield,      // Step 10: Add Safety
  Hash,        // Step 11: Line Numbers
  PartyPopper  // Step 12: Victory Dance
]

// State
const currentSlide = ref(0)
const isPlaying = ref(false)
const autoPlayInterval = ref<NodeJS.Timeout | null>(null)
const slideDirection = ref('forward')

// Pipeline state
const selectedStep = ref<any>(null)
const completedSteps = ref<number[]>([])
const showPopup = ref(false)

// Video popup state
const showVideoPopup = ref(false)
const selectedVideo = ref<any>(null)
const videoElement = ref<HTMLVideoElement | null>(null)
const speedupTimeout = ref<NodeJS.Timeout | null>(null)

// Audio for drilling sound
const drillAudio = ref<HTMLAudioElement | null>(null)

// Background video control
const backgroundVideo = ref<HTMLVideoElement | null>(null)
const isBackgroundVideoPlaying = ref(true)

// Slides data
const slides = computed(() => [
  {
    id: 'title',
    type: 'title',
    icon: GraduationCap,
    content: {
      title: t('app.title'),
      subtitle: t('app.subtitle'),
      name: t('app.studentName'),
      badges: [t('app.author'), t('app.school')]
    }
  },
  {
    id: 'cnc-comparison',
    type: 'video-comparison',
    icon: Blocks,
    content: {
      title: t('presentation.cncComparison.title'),
      videos: [
        {
          title: t('presentation.cncComparison.legoTitle'),
          videoId: 'ZYlbLQmDtKM',
          startTime: 66,
          playbackRate: 2
        },
        {
          title: t('presentation.cncComparison.realTitle'),
          videoId: 'CTALkmCsYds',
          startTime: 48,
          playbackRate: 1
        }
      ]
    }
  },
  {
    id: 'about',
    type: 'content',
    content: {
      icon: Lightbulb,
      title: t('presentation.about.title'),
      paragraphs: [
        t('presentation.about.description1'),
        t('presentation.about.description2'),
        t('presentation.about.description3'),
        t('presentation.about.features.0'),
        t('presentation.about.features.1'),
        t('presentation.about.features.2')
      ]
    }
  },
  {
    id: 'tool-management',
    type: 'video-image-comparison',
    content: {
      icon: Wrench,
      title: t('presentation.toolManagement.title'),
      description: t('presentation.toolManagement.description'),
      items: [
        {
          title: 'Mach3 algne tööriistatabel',
          type: 'image',
          path: '/assets/images/mach3ToolTable.png'
        },
        {
          title: 'Uue süsteemi UI',
          type: 'video',
          driveFileId: '1PFYTeMn5iqrwbEh385QVBOBB3XX03Rp8',
          isClickable: true
        }
      ]
    }
  },
  {
    id: 'dxf-to-gcode',
    type: 'video-comparison',
    icon: Code,
    content: {
      title: t('presentation.dxfToGcode.title'),
      description: t('presentation.dxfToGcode.description'),
      videos: [
        {
          title: 'DXF fail',
          type: 'video',
          driveFileId: '1_t4TqswVFHx9kyezBUWUMSZtQGQSh-6e'
        },
        {
          title: 'Mach3 demo',
          type: 'video',
          driveFileId: '11IPq-NUrhwHY_JNVklNf5JD7qucPAUiy'
        }
      ]
    }
  },
  {
    id: 'pipeline',
    type: 'pipeline',
    content: {
      title: t('pipeline.title'),
      subtitle: t('pipeline.subtitle'),
      steps: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        icon: stepIcons[i],
        emoji: ['📖', '🔍', '📐', '🔄', '📍', '⚡', '🔧', '🤖', '✨', '🛡️', '#️⃣', '🎉'][i],
        title: t(`pipeline.steps.${i + 2}.title`), // Skip step 1 (coffee) in translations
        description: t(`pipeline.steps.${i + 2}.description`),
        example: t(`pipeline.steps.${i + 2}.example`),
        images: i === 0 ? [
          { src: '/assets/images/egyptianHieroglyphs.png', caption: 'Tundub nagu...' },
          { src: '/assets/images/dxf.png', caption: 'Tegelikult on...' }
        ] : i === 1 ? [
          { src: '/assets/images/pointDrawing.png', caption: 'Punkt B joonisel' }
        ] : i === 3 ? [
          { src: '/assets/images/tetrisIBlock.jpeg', caption: 'Vertikaalne või horisontaalne?' }
        ] : i === 9 ? [
          { src: '/assets/images/safetyMacro.png', caption: 'M150 ohutuskontroll' }
        ] : null, // DXF parsing is index 0, Extract Drilling is index 1, Orient Workpiece is index 3, Add Safety is index 9
        particles: [
          ['📄', '📐', '📏', '✏️', '📊'],
          ['🕳️', '⭕', '🎯', '📍', '🔍'],
          ['📏', '📐', '🔢', '➕', '➖'],
          ['🔄', '↩️', '↪️', '🔃', '🔁'],
          ['📍', '🗺️', '🧭', '📌', '🎯'],
          ['⚡', '✨', '💫', '🌟', '⭐'],
          ['🔧', '🔨', '🛠️', '⚙️', '🔩'],
          ['🤖', '💻', '⚙️', '🖥️', '💾'],
          ['✨', '🌟', '💫', '⭐', '🌠'],
          ['🛡️', '🔒', '🔐', '🗝️', '🚨'],
          ['#️⃣', '🔢', '📝', '📋', '🏷️'],
          ['🎉', '🎊', '🏆', '🥳', '🎯']
        ][i]
      }))
    }
  },
  {
    id: 'technologies',
    type: 'technologies',
    icon: Cpu,
    content: {
      title: 'Tehnoloogiad',
      items: [
        {
          title: 'Biesse Rover 321R',
          subtitle: 'CNC-töötlemiskeskus',
          image: '/assets/images/biesse.jpeg'
        },
        {
          title: 'Mach3',
          subtitle: 'Juhtimistarkvara',
          image: '/assets/images/artsoftLogo.png'
        },
        {
          title: 'Python',
          subtitle: 'Arendus',
          image: '/assets/images/pythonLogo.png'
        },
        {
          title: 'VBScript',
          subtitle: 'Arendus',
          image: '/assets/images/VB-Script-2.jpg'
        },
        {
          title: 'CSV',
          subtitle: 'Andmehaldus'
        },
        {
          title: 'Probleemide lahendamine',
          subtitle: 'Loominguline lähenemine',
          icon: Puzzle
        }
      ]
    }
  },
  {
    id: 'funfacts',
    type: 'stats',
    icon: Coffee,
    content: {
      title: t('presentation.funFacts.title'),
      stats: [
        { icon: Candy, value: '∞', label: t('presentation.funFacts.coffeesConsumed') },
        { icon: Save, value: '180', label: t('presentation.funFacts.documentationFiles') },
        { icon: Drill, value: '18,456', label: t('presentation.funFacts.holesOptimized') },
        { icon: Github, value: '129', label: t('presentation.funFacts.githubCommits') }
      ],
      quote: t('presentation.quotes.0'),
      thankYou: 'Tänan kuulamast!'
    }
  },
  {
    id: 'drilling-video',
    type: 'google-drive-video',
    content: {
      driveFileId: '1ERxKjy768fZdG-yE9V9OxR1XHwzQUgIV',
      title: 'Drilling Process'
    }
  }
])

// Total slides
const totalSlides = computed(() => slides.value.length)

// Video control
const videoTimeouts = ref<NodeJS.Timeout[]>([])

const handleVideoComparison = () => {
  // Clear any existing timeouts
  videoTimeouts.value.forEach(timeout => clearTimeout(timeout))
  videoTimeouts.value = []
  
  // Wait for iframes to load
  const setupTimeout = setTimeout(() => {
    const iframes = document.querySelectorAll('iframe[data-playback-rate]')
    iframes.forEach((iframe: HTMLIFrameElement) => {
      const rate = parseFloat(iframe.getAttribute('data-playback-rate') || '1')
      
      // Set playback rate if needed
      if (rate !== 1) {
        iframe.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'setPlaybackRate',
            args: [rate]
          }),
          '*'
        )
      }
      
      // Stop video after 20 seconds
      const stopTimeout = setTimeout(() => {
        iframe.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'pauseVideo'
          }),
          '*'
        )
      }, 20000) // 20 seconds
      
      videoTimeouts.value.push(stopTimeout)
    })
  }, 1500) // Wait for YouTube players to load
  
  videoTimeouts.value.push(setupTimeout)
}

// Watch for slide changes
watch(currentSlide, async (newSlide, oldSlide) => {
  await nextTick()
  
  // Clear video timeouts when leaving video comparison slide
  if (slides.value[oldSlide]?.type === 'video-comparison') {
    videoTimeouts.value.forEach(timeout => clearTimeout(timeout))
    videoTimeouts.value = []
  }
  
  // Handle video comparison slide
  if (slides.value[newSlide]?.type === 'video-comparison') {
    handleVideoComparison()
  }
  
  // Reset background video state when entering video background slide
  if (slides.value[newSlide]?.type === 'video-background') {
    isBackgroundVideoPlaying.value = true
  }
})

// Navigation
const nextSlide = () => {
  slideDirection.value = 'forward'
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0 // Loop back to start
  }
}

const prevSlide = () => {
  slideDirection.value = 'backward'
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = totalSlides.value - 1 // Go to last
  }
}

// Auto-play
const toggleAutoPlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    autoPlayInterval.value = setInterval(nextSlide, 5000) // 5 seconds per slide
  } else {
    if (autoPlayInterval.value) {
      clearInterval(autoPlayInterval.value)
      autoPlayInterval.value = null
    }
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  // If popup is open, only handle Escape key
  if (showPopup.value || showVideoPopup.value) {
    if (e.key === 'Escape') {
      if (showPopup.value) closePopup()
      if (showVideoPopup.value) closeVideoPopup()
    }
    return
  }
  
  switch (e.key) {
    case 'ArrowRight':
    case ' ':
      nextSlide()
      break
    case 'ArrowLeft':
      prevSlide()
      break
    case 'p':
    case 'P':
      toggleAutoPlay()
      break
    case 'Enter':
      // If on pipeline slide and no popup is open, select the next available step
      if (slides.value[currentSlide.value].type === 'pipeline') {
        const pipelineSteps = slides.value[currentSlide.value].content.steps
        const nextAvailableStep = pipelineSteps.find(step => 
          getStepStatus(step.id) === 'available'
        )
        if (nextAvailableStep) {
          selectStep(nextAvailableStep)
        }
      }
      // If on video-image-comparison slide, open clickable item popup
      else if (slides.value[currentSlide.value].type === 'video-image-comparison') {
        const clickableItem = slides.value[currentSlide.value].content.items.find(item => 
          item.type === 'video' || (item.type === 'image' && item.isClickable)
        )
        if (clickableItem) {
          if (clickableItem.type === 'video') {
            openVideoPopup(clickableItem)
          } else {
            openImagePopup(clickableItem)
          }
        }
      }
      break
    case 'Escape':
      if (isPlaying.value) {
        toggleAutoPlay()
      }
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
})

// Pipeline functions
const selectStep = (step: any) => {
  // Check if step is unlocked (first step or previous is completed)
  const canAccess = step.id === 1 || completedSteps.value.includes(step.id - 1)
  
  if (!canAccess) {
    // Show locked animation or feedback
    return
  }
  
  selectedStep.value = step
  showPopup.value = true
  
  // Play drilling sound for Victory Dance (step 12)
  if (step.id === 12) {
    playDrillingSound()
  }
  
  // Mark as completed after viewing
  setTimeout(() => {
    if (!completedSteps.value.includes(step.id)) {
      completedSteps.value.push(step.id)
    }
  }, 1000)
}

const closePopup = () => {
  showPopup.value = false
  selectedStep.value = null
}


const getStepStatus = (stepId: number) => {
  if (completedSteps.value.includes(stepId)) return 'completed'
  if (stepId === 1 || completedSteps.value.includes(stepId - 1)) return 'available'
  return 'locked'
}

// Play drilling sound effect
const playDrillingSound = () => {
  // Create audio element for drilling sound
  drillAudio.value = new Audio('/assets/sounds/drill-200178.mp3')
  drillAudio.value.volume = 0.5 // Set volume to 50%
  
  // Play the sound
  drillAudio.value.play()
  
  // Stop after 6 seconds
  setTimeout(() => {
    if (drillAudio.value) {
      drillAudio.value.pause()
      drillAudio.value.currentTime = 0
    }
  }, 6000)
}

// Video popup functions
const openVideoPopup = (video: any) => {
  selectedVideo.value = video
  showVideoPopup.value = true
  
  // Set up speedup for mach3demo video after 40 seconds
  if (video.path && video.path.includes('mach3demo')) {
    speedupTimeout.value = setTimeout(() => {
      if (videoElement.value) {
        videoElement.value.playbackRate = 3.0
      }
    }, 40000) // 40 seconds
  }
}

const closeVideoPopup = () => {
  showVideoPopup.value = false
  selectedVideo.value = null
  
  // Clear speedup timeout
  if (speedupTimeout.value) {
    clearTimeout(speedupTimeout.value)
    speedupTimeout.value = null
  }
  
  // Reset video playback rate
  if (videoElement.value) {
    videoElement.value.playbackRate = 1.0
    videoElement.value = null
  }
}

// Image popup functions
const openImagePopup = (image: any) => {
  selectedVideo.value = image // Reuse video popup for images
  showVideoPopup.value = true
}

// Toggle background video play/pause
const toggleBackgroundVideo = () => {
  if (backgroundVideo.value) {
    if (isBackgroundVideoPlaying.value) {
      backgroundVideo.value.pause()
    } else {
      backgroundVideo.value.play()
    }
    isBackgroundVideoPlaying.value = !isBackgroundVideoPlaying.value
  }
}
</script>

<template>
  <Head :title="t('app.title')" />
  
  <div class="h-screen bg-background flex flex-col overflow-hidden">

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Slide counter badge -->
      <Badge variant="outline" class="absolute top-2 right-2 z-10">
        {{ currentSlide + 1 }} / {{ totalSlides }}
      </Badge>
      <transition 
        mode="out-in" 
        :enter-active-class="'transition-all duration-300 ease-out'"
        :enter-from-class="slideDirection === 'forward' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'"
        :enter-to-class="'translate-x-0 opacity-100'"
        :leave-active-class="'transition-all duration-300 ease-in'"
        :leave-from-class="'translate-x-0 opacity-100'"
        :leave-to-class="slideDirection === 'forward' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'"
      >
        <!-- Title Slide -->
        <div v-if="slides[currentSlide].type === 'title'" :key="slides[currentSlide].id" class="w-full h-full flex items-center justify-center px-20">
          <Card class="border-0 shadow-none w-full max-w-5xl">
            <CardHeader class="text-center p-6 md:p-8">
              <div class="flex justify-center mb-4">
                <component :is="slides[currentSlide].icon" class="h-16 w-16 md:h-20 md:w-20 text-muted-foreground" />
              </div>
              <CardTitle class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {{ slides[currentSlide].content.title }}
              </CardTitle>
              <CardDescription v-if="slides[currentSlide].content.subtitle" class="text-lg md:text-xl mb-4">
                {{ slides[currentSlide].content.subtitle }}
              </CardDescription>
              <h2 v-if="slides[currentSlide].content.name" class="text-xl md:text-2xl font-bold mb-4">{{ slides[currentSlide].content.name }}</h2>
              <div v-if="slides[currentSlide].content.badges && slides[currentSlide].content.badges.length" class="flex flex-wrap justify-center gap-2">
                <Badge v-for="badge in slides[currentSlide].content.badges" :key="badge" variant="secondary" class="text-sm px-3 py-1">
                  {{ badge }}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        <!-- Feature Slide -->
        <div v-else-if="slides[currentSlide].type === 'feature'" :key="slides[currentSlide].id" class="w-full max-w-4xl">
          <Card class="border-0 shadow-none">
            <CardHeader class="text-center pb-4">
              <div class="flex justify-center mb-3">
                <component :is="slides[currentSlide].content.icon" class="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle class="text-2xl font-bold mb-2">{{ slides[currentSlide].content.title }}</CardTitle>
              <CardDescription class="text-base">{{ slides[currentSlide].content.description }}</CardDescription>
            </CardHeader>
            <CardContent class="pb-4">
              <ul class="space-y-2 text-base max-w-2xl mx-auto">
                <li v-for="feature in slides[currentSlide].content.features" :key="feature" class="flex items-start">
                  <span v-if="slides[currentSlide].id !== 'about'" class="mr-3 text-lg">•</span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <!-- Stats Slide -->
        <div v-else-if="slides[currentSlide].type === 'stats'" :key="slides[currentSlide].id" class="w-full max-w-5xl text-center">
          <h2 class="text-3xl font-bold mb-8">{{ slides[currentSlide].content.title }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div v-for="stat in slides[currentSlide].content.stats" :key="stat.label" class="text-center">
              <component :is="stat.icon" class="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <div class="text-3xl font-bold mb-1">{{ stat.value }}</div>
              <div class="text-xs text-muted-foreground">{{ stat.label }}</div>
            </div>
          </div>
          <blockquote class="text-lg italic text-muted-foreground mb-8">
            {{ slides[currentSlide].content.quote }}
          </blockquote>
          <h1 class="text-4xl font-bold text-foreground">{{ slides[currentSlide].content.thankYou }}</h1>
        </div>

        <!-- Content Slide -->
        <div v-else-if="slides[currentSlide].type === 'content'" :key="slides[currentSlide].id" class="w-full max-w-4xl">
          <Card class="border-0 shadow-none">
            <CardHeader class="text-center pb-4">
              <div class="flex justify-center mb-3">
                <component :is="slides[currentSlide].content.icon" class="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle class="text-2xl font-bold mb-2">{{ slides[currentSlide].content.title }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <p v-for="(paragraph, index) in slides[currentSlide].content.paragraphs" :key="index" class="text-lg leading-relaxed">
                {{ paragraph }}
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Pipeline Slide -->
        <div v-else-if="slides[currentSlide].type === 'pipeline'" :key="slides[currentSlide].id" class="w-full h-full flex flex-col">
          <div class="text-center mb-4">
            <h2 class="text-2xl font-bold mb-1">
              {{ slides[currentSlide].content.title }}
            </h2>
          </div>
          
          <div class="grid grid-cols-3 md:grid-cols-4 gap-3 flex-1">
            <div 
              v-for="step in slides[currentSlide].content.steps" 
              :key="step.id"
              @click="selectStep(step)"
              :class="[
                'transform transition-all duration-300',
                getStepStatus(step.id) !== 'locked' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
              ]"
            >
              <Card 
                :class="[
                  'relative overflow-hidden border-0 h-full',
                  getStepStatus(step.id) === 'completed' ? 'bg-muted/50' : 
                  getStepStatus(step.id) === 'available' ? 'bg-muted/30 hover:bg-muted/50 hover:shadow-lg' :
                  'bg-muted/10 opacity-50'
                ]"
              >
                <CardHeader class="text-center p-3">
                  <div class="mb-1 flex justify-center">
                    <component 
                      :is="getStepStatus(step.id) === 'locked' ? Lock : step.icon" 
                      :class="[
                        'h-8 w-8 text-muted-foreground',
                        getStepStatus(step.id) === 'available' ? 'animate-bounce-slow' : ''
                      ]"
                    />
                  </div>
                  <CardTitle class="text-xs leading-tight">{{ step.title }}</CardTitle>
                  <Badge 
                    v-if="getStepStatus(step.id) === 'completed'" 
                    variant="secondary" 
                    class="absolute top-1 right-1 text-xs px-1 py-0"
                  >
                    ✓
                  </Badge>
                  <Badge 
                    v-if="getStepStatus(step.id) === 'available' && step.id === 1" 
                    variant="default" 
                    class="absolute top-1 right-1 text-xs px-1 py-0 animate-pulse"
                  >
                    Start
                  </Badge>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        <!-- Video Comparison Slide -->
        <div v-else-if="slides[currentSlide].type === 'video-comparison'" :key="slides[currentSlide].id" class="w-full h-full flex flex-col">
          <div class="text-center mb-4">
            <div class="flex justify-center mb-3">
              <component :is="slides[currentSlide].icon" class="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 class="text-3xl font-bold mb-2">{{ slides[currentSlide].content.title }}</h2>
            <p v-if="slides[currentSlide].content.description && slides[currentSlide].id !== 'dxf-to-gcode'" class="text-lg text-muted-foreground">{{ slides[currentSlide].content.description }}</p>
          </div>
          
          <div class="flex-1 flex items-center justify-center gap-8 px-8">
            <div v-for="video in slides[currentSlide].content.videos" :key="video.videoId || video.path" class="w-full max-w-md flex flex-col">
              <h3 class="text-xl font-semibold text-center mb-3 text-muted-foreground">{{ video.title }}</h3>
              <div class="relative bg-black rounded-lg overflow-hidden" style="aspect-ratio: 16/9;">
                <!-- YouTube videos -->
                <iframe v-if="video.videoId"
                  :src="`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&start=${video.startTime}&enablejsapi=1`"
                  class="absolute inset-0 w-full h-full"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  :data-playback-rate="video.playbackRate"
                  :data-video-id="video.videoId"
                />
                <!-- Google Drive videos -->
                <iframe v-else-if="video.driveFileId"
                  :src="`https://drive.google.com/file/d/${video.driveFileId}/preview`"
                  class="absolute inset-0 w-full h-full"
                  frameborder="0"
                  allow="autoplay"
                  allowfullscreen
                />
                <!-- Local videos -->
                <div v-else-if="video.path" 
                  @click="openVideoPopup(video)"
                  class="absolute inset-0 cursor-pointer transform transition-all duration-300 hover:scale-105 group"
                >
                  <div class="absolute inset-0 bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="bg-background/80 rounded-full p-6 shadow-lg transform transition-all duration-300 group-hover:scale-110">
                        <Play class="h-12 w-12 text-foreground" />
                      </div>
                    </div>
                    <video 
                      :src="video.path" 
                      class="w-full h-full object-cover opacity-50"
                      muted
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Video-Image Comparison Slide -->
        <div v-else-if="slides[currentSlide].type === 'video-image-comparison'" :key="slides[currentSlide].id" class="w-full h-full flex flex-col">
          <div class="text-center mb-4">
            <div class="flex justify-center mb-3">
              <component :is="slides[currentSlide].content.icon" class="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 class="text-3xl font-bold mb-2">{{ slides[currentSlide].content.title }}</h2>
            <p class="text-lg text-muted-foreground">{{ slides[currentSlide].content.description }}</p>
          </div>
          
          <div class="flex-1 flex gap-8 px-8">
            <div v-for="item in slides[currentSlide].content.items" :key="item.title" class="flex-1 flex flex-col">
              <h3 class="text-xl font-semibold text-center mb-3 text-muted-foreground">{{ item.title }}</h3>
              <div class="flex-1 relative rounded-lg overflow-hidden">
                <div v-if="item.type === 'video' && item.driveFileId" 
                  class="relative h-full rounded-lg overflow-hidden"
                >
                  <iframe 
                    :src="`https://drive.google.com/file/d/${item.driveFileId}/preview`"
                    class="w-full h-full"
                    frameborder="0"
                    allow="autoplay"
                    allowfullscreen
                  />
                </div>
                <div v-else-if="item.type === 'video' && item.path" 
                  @click="openVideoPopup(item)"
                  class="relative h-full cursor-pointer transform transition-all duration-300 hover:scale-105 group"
                >
                  <Card class="h-full border-0 bg-muted/30 hover:bg-muted/50 hover:shadow-lg">
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="bg-background/80 rounded-full p-8 shadow-lg transform transition-all duration-300 group-hover:scale-110">
                        <Play class="h-16 w-16 text-foreground" />
                      </div>
                    </div>
                    <video 
                      :src="item.path" 
                      class="w-full h-full object-cover opacity-50"
                      muted
                    />
                  </Card>
                </div>
                <div v-else-if="item.type === 'image' && item.isClickable" 
                  @click="openImagePopup(item)"
                  class="relative h-full cursor-pointer transform transition-all duration-300 hover:scale-105 group"
                >
                  <Card class="h-full border-0 bg-muted/30 hover:bg-muted/50 hover:shadow-lg">
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="bg-background/80 rounded-full p-8 shadow-lg transform transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100">
                        <Search class="h-16 w-16 text-foreground" />
                      </div>
                    </div>
                    <img 
                      :src="item.path" 
                      :alt="item.title"
                      class="w-full h-full object-contain p-4"
                    />
                  </Card>
                </div>
                <img v-else-if="item.type === 'image'" 
                  :src="item.path" 
                  :alt="item.title"
                  class="w-full h-full object-contain bg-muted/30 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Technologies Slide -->
        <div v-else-if="slides[currentSlide].type === 'technologies'" :key="slides[currentSlide].id" class="w-full h-full flex flex-col">
          <div class="text-center mb-2">
            <div class="flex justify-center mb-1">
              <component :is="slides[currentSlide].icon" class="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 class="text-2xl font-bold">{{ slides[currentSlide].content.title }}</h2>
          </div>
          
          <div class="flex-1 grid grid-cols-3 gap-3 px-4 py-1">
            <div v-for="item in slides[currentSlide].content.items" :key="item.title" 
              class="transform transition-all duration-300 hover:scale-105"
            >
              <Card class="h-full border-0 bg-muted/30 hover:bg-muted/50 hover:shadow-lg">
                <CardHeader class="text-center p-3">
                  <div v-if="item.image" class="mb-2 flex justify-center">
                    <img 
                      :src="item.image" 
                      :alt="item.title"
                      class="h-12 w-auto object-contain"
                    />
                  </div>
                  <div v-else-if="item.icon" class="mb-2 flex justify-center">
                    <component :is="item.icon" class="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div v-else class="mb-2 flex justify-center">
                    <FileText class="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle class="text-sm mb-1">{{ item.title }}</CardTitle>
                  <CardDescription class="text-xs font-semibold">{{ item.subtitle }}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        <!-- Video Background Slide -->
        <div v-else-if="slides[currentSlide].type === 'video-background'" :key="slides[currentSlide].id" class="w-full h-full relative flex items-center justify-center bg-background">
          <div class="w-1/2 h-1/2 relative rounded-lg overflow-hidden shadow-2xl">
            <video 
              ref="backgroundVideo"
              :src="slides[currentSlide].content.videoPath"
              class="absolute inset-0 w-full h-full object-cover"
              autoplay
              muted
              :loop="slides[currentSlide].content.loop"
              :playbackRate="slides[currentSlide].content.playbackRate"
              @loadedmetadata="(e) => { e.target.playbackRate = slides[currentSlide].content.playbackRate }"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <Button 
                @click="toggleBackgroundVideo"
                variant="secondary"
                size="icon"
                class="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <component :is="isBackgroundVideoPlaying ? Pause : Play" class="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Google Drive Video Slide -->
        <div v-else-if="slides[currentSlide].type === 'google-drive-video'" :key="slides[currentSlide].id" class="w-full h-full relative flex items-center justify-center bg-background">
          <div class="w-1/2 h-1/2 max-w-2xl max-h-[50vh] relative">
            <iframe 
              :src="`https://drive.google.com/file/d/${slides[currentSlide].content.driveFileId}/preview`"
              class="w-full h-full rounded-lg shadow-2xl"
              frameborder="0"
              allow="autoplay"
              allowfullscreen
            />
          </div>
        </div>
      </transition>
      
      <!-- Side navigation arrows inside content area -->
      <Button 
        @click="prevSlide" 
        variant="ghost" 
        size="icon"
        class="absolute left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-muted/50 hover:bg-muted z-20"
      >
        <ChevronLeft class="h-6 w-6" />
      </Button>

      <Button 
        @click="nextSlide" 
        variant="ghost" 
        size="icon"
        class="absolute right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-muted/50 hover:bg-muted z-20"
      >
        <ChevronRight class="h-6 w-6" />
      </Button>
    </div>




    <!-- Step popup -->
    <transition name="popup">
      <div v-if="showPopup && selectedStep" class="fixed inset-0 flex items-center justify-center z-40 p-8" @click="closePopup">
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <Card class="relative max-w-5xl w-full animate-popup-in z-50 border-0 shadow-2xl" @click.stop>
          <CardHeader class="text-center">
            <div class="mb-4 flex justify-center">
              <component :is="selectedStep.icon" class="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle class="text-3xl mb-2">{{ selectedStep.title }}</CardTitle>
            <CardDescription class="text-xl">{{ selectedStep.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="bg-muted/50 rounded-lg p-6">
              <!-- Check if this is Extract Drilling step with image and example data -->
              <div v-if="selectedStep.images && selectedStep.example && selectedStep.images.length === 1 && !selectedStep.title.includes('pööramine')" class="flex gap-6">
                <!-- Image on the left -->
                <div class="flex-1">
                  <img :src="selectedStep.images[0].src" :alt="selectedStep.images[0].caption" class="rounded-lg w-full" />
                  <p class="text-sm text-muted-foreground italic text-center mt-2">{{ selectedStep.images[0].caption }}</p>
                </div>
                <!-- Data on the right -->
                <div class="flex-1">
                  <pre class="text-sm font-mono whitespace-pre-wrap bg-background/50 p-4 rounded-lg">{{ selectedStep.example }}</pre>
                </div>
              </div>
              <!-- Special layout for rotation step -->
              <div v-else-if="selectedStep.images && selectedStep.example && selectedStep.title.includes('pööramine')" class="flex gap-6">
                <!-- Tetris pieces on the left -->
                <div class="flex-1 flex justify-center items-center">
                  <div class="flex items-center gap-4">
                    <div class="text-center">
                      <img :src="selectedStep.images[0].src" :alt="'Vertikaalne'" class="rounded-lg h-24" />
                      <p class="text-sm text-muted-foreground italic mt-2">Vertikaalne</p>
                    </div>
                    <div class="text-2xl">→</div>
                    <div class="text-center">
                      <img :src="selectedStep.images[0].src" :alt="'Horisontaalne'" class="rounded-lg h-24" style="transform: rotate(90deg);" />
                      <p class="text-sm text-muted-foreground italic mt-2">Horisontaalne</p>
                    </div>
                  </div>
                </div>
                <!-- Data on the right -->
                <div class="flex-1">
                  <pre class="text-sm font-mono whitespace-pre-wrap bg-background/50 p-4 rounded-lg">{{ selectedStep.example }}</pre>
                </div>
              </div>
              <!-- Default layout for other steps -->
              <div v-else>
                <pre v-if="selectedStep.example" class="text-lg font-mono whitespace-pre-wrap mb-4">{{ selectedStep.example }}</pre>
                <!-- Single image (backward compatibility) -->
                <img v-if="selectedStep.image" :src="selectedStep.image" alt="Step illustration" class="mt-4 rounded-lg max-h-64 mx-auto" />
                <!-- Multiple images -->
                <div v-if="selectedStep.images && !selectedStep.example" class="flex gap-6 justify-center items-start">
                  <div v-for="img in selectedStep.images" :key="img.src" class="text-center">
                    <div v-if="img.src.includes('dxf.png')" class="rounded-lg overflow-hidden mb-2" style="max-height: 16rem;">
                      <img :src="img.src" :alt="img.caption" class="w-full" style="margin-top: 0; object-fit: cover; object-position: top;" />
                    </div>
                    <img v-else :src="img.src" :alt="img.caption" class="rounded-lg max-h-64 mb-2" />
                    <p class="text-sm text-muted-foreground italic">{{ img.caption }}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <div class="absolute top-4 right-4">
            <Button @click="closePopup" variant="ghost" size="icon">
              ✕
            </Button>
          </div>
        </Card>
      </div>
    </transition>

    <!-- Video popup -->
    <transition name="popup">
      <div v-if="showVideoPopup && selectedVideo" class="fixed inset-0 flex items-center justify-center z-40 p-4" @click="closeVideoPopup">
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <Card class="relative w-full h-full max-w-[95vw] max-h-[95vh] animate-popup-in z-50 border-0 shadow-2xl" @click.stop>
          <CardContent class="h-full p-4">
            <video v-if="selectedVideo.type === 'video'"
              ref="videoElement"
              :src="selectedVideo.path" 
              class="w-full h-full object-contain"
              controls
              autoplay
              @loadedmetadata="() => { if (selectedVideo.path && selectedVideo.path.includes('mach3demo') && videoElement) videoElement.currentTime = 0 }"
            />
            <img v-else-if="selectedVideo.type === 'image'"
              :src="selectedVideo.path" 
              :alt="selectedVideo.title"
              class="w-full h-full object-contain"
            />
          </CardContent>
          <div class="absolute top-4 right-4">
            <Button @click="closeVideoPopup" variant="ghost" size="icon">
              ✕
            </Button>
          </div>
        </Card>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-150px) scale(1.5) rotate(360deg);
  }
}

@keyframes popup-in {
  0% {
    transform: scale(0.8) translateY(20px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-popup-in {
  animation: popup-in 0.3s ease-out;
}

.particle-enter-active {
  transition: all 0.3s ease;
}

.particle-enter-from {
  opacity: 0;
  transform: scale(0);
}

.particle-leave-active {
  transition: all 0.3s ease;
}

.particle-leave-to {
  opacity: 0;
  transform: scale(2);
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-active .animate-popup-in,
.popup-leave-active .animate-popup-in {
  transition: transform 0.3s ease;
}

.popup-enter-from .animate-popup-in {
  transform: scale(0.8) translateY(20px);
}

.popup-leave-to .animate-popup-in {
  transform: scale(0.8) translateY(20px);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
</style>
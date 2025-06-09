<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Head } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Trophy,
  Sparkles,
  Coffee,
  Star
} from 'lucide-vue-next'
import LanguageSelector from '@/components/LanguageSelector.vue'

const { t } = useI18n()

// Game state
const currentStep = ref(-1)
const isRunning = ref(false)
const isPaused = ref(false)
const score = ref(0)
const combo = ref(0)
const particles = ref<Array<{id: number, x: number, y: number, emoji: string}>>([])
const completedSteps = ref<number[]>([])
const hoveredStep = ref<number | null>(null)
const powerMode = ref(false)
const coffeeLevel = ref(100)

// Pipeline steps
const steps = computed(() => [
  {
    id: 1,
    emoji: '🎬',
    title: t('pipeline.steps.1.title'),
    description: t('pipeline.steps.1.description'),
    example: t('pipeline.steps.1.example'),
    points: 100,
    duration: 2000,
    particles: ['☕', '😴', '😊', '💤', '⏰']
  },
  {
    id: 2,
    emoji: '📖',
    title: t('pipeline.steps.2.title'),
    description: t('pipeline.steps.2.description'),
    example: t('pipeline.steps.2.example'),
    points: 150,
    duration: 3000,
    particles: ['📄', '📐', '📏', '✏️', '📊']
  },
  {
    id: 3,
    emoji: '🔍',
    title: t('pipeline.steps.3.title'),
    description: t('pipeline.steps.3.description'),
    example: t('pipeline.steps.3.example'),
    points: 200,
    duration: 3000,
    particles: ['🕳️', '⭕', '🎯', '📍', '🔍']
  },
  {
    id: 4,
    emoji: '📐',
    title: t('pipeline.steps.4.title'),
    description: t('pipeline.steps.4.description'),
    example: t('pipeline.steps.4.example'),
    points: 250,
    duration: 3000,
    particles: ['📏', '📐', '🔢', '➕', '➖']
  },
  {
    id: 5,
    emoji: '🔄',
    title: t('pipeline.steps.5.title'),
    description: t('pipeline.steps.5.description'),
    example: t('pipeline.steps.5.example'),
    points: 200,
    duration: 3000,
    particles: ['🔄', '↩️', '↪️', '🔃', '🔁']
  },
  {
    id: 6,
    emoji: '📍',
    title: t('pipeline.steps.6.title'),
    description: t('pipeline.steps.6.description'),
    example: t('pipeline.steps.6.example'),
    points: 300,
    duration: 3000,
    particles: ['📍', '🗺️', '🧭', '📌', '🎯']
  },
  {
    id: 7,
    emoji: '⚡',
    title: t('pipeline.steps.7.title'),
    description: t('pipeline.steps.7.description'),
    example: t('pipeline.steps.7.example'),
    points: 350,
    duration: 3000,
    particles: ['⚡', '✨', '💫', '🌟', '⭐']
  },
  {
    id: 8,
    emoji: '🔧',
    title: t('pipeline.steps.8.title'),
    description: t('pipeline.steps.8.description'),
    example: t('pipeline.steps.8.example'),
    points: 400,
    duration: 3000,
    particles: ['🔧', '🔨', '🛠️', '⚙️', '🔩']
  },
  {
    id: 9,
    emoji: '🤖',
    title: t('pipeline.steps.9.title'),
    description: t('pipeline.steps.9.description'),
    example: t('pipeline.steps.9.example'),
    points: 500,
    duration: 3000,
    particles: ['🤖', '💻', '⚙️', '🖥️', '💾']
  },
  {
    id: 10,
    emoji: '✨',
    title: t('pipeline.steps.10.title'),
    description: t('pipeline.steps.10.description'),
    example: t('pipeline.steps.10.example'),
    points: 450,
    duration: 3000,
    particles: ['✨', '🌟', '💫', '⭐', '🌠']
  },
  {
    id: 11,
    emoji: '🛡️',
    title: t('pipeline.steps.11.title'),
    description: t('pipeline.steps.11.description'),
    example: t('pipeline.steps.11.example'),
    points: 600,
    duration: 3000,
    particles: ['🛡️', '🔒', '🔐', '🗝️', '🚨']
  },
  {
    id: 12,
    emoji: '🎉',
    title: t('pipeline.steps.12.title'),
    description: t('pipeline.steps.12.description'),
    example: t('pipeline.steps.12.example'),
    points: 1000,
    duration: 2000,
    particles: ['🎉', '🎊', '🏆', '🥳', '🎯', '💃', '🕺', '🚀', '🌈', '🎆']
  }
])

// Progress
const progress = computed(() => ((completedSteps.value.length) / steps.value.length) * 100)

// Total possible score
const maxScore = computed(() => steps.value.reduce((acc, step) => acc + step.points, 0))

// Create particle effect
const createParticles = (step: any, x: number, y: number) => {
  const particleEmojis = step.particles
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const particle = {
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)]
      }
      particles.value.push(particle)
      
      // Remove particle after animation
      setTimeout(() => {
        particles.value = particles.value.filter(p => p.id !== particle.id)
      }, 2000)
    }, i * 100)
  }
}

// Start the game
const startGame = () => {
  isRunning.value = true
  isPaused.value = false
  currentStep.value = 0
  score.value = 0
  combo.value = 0
  completedSteps.value = []
  coffeeLevel.value = 100
  runStep(0)
}

// Run a single step
const runStep = (index: number) => {
  if (!isRunning.value || isPaused.value) return
  
  if (index >= steps.value.length) {
    // Game complete
    isRunning.value = false
    celebrate()
    return
  }
  
  currentStep.value = index
  
  // Decrease coffee level
  coffeeLevel.value = Math.max(0, coffeeLevel.value - 8)
  
  // Simulate processing time
  setTimeout(() => {
    if (isRunning.value && !isPaused.value) {
      completeStep(index)
      runStep(index + 1)
    }
  }, steps.value[index].duration)
}

// Complete a step
const completeStep = (index: number) => {
  if (!completedSteps.value.includes(index)) {
    completedSteps.value.push(index)
    
    // Calculate score with combo
    const basePoints = steps.value[index].points
    const comboBonus = combo.value * 50
    const totalPoints = basePoints + comboBonus
    
    score.value += totalPoints
    combo.value++
    
    // Create particles at step location
    const element = document.querySelector(`[data-step="${index}"]`)
    if (element) {
      const rect = element.getBoundingClientRect()
      createParticles(steps.value[index], rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    
    // Power mode at high combo
    if (combo.value >= 5) {
      powerMode.value = true
      setTimeout(() => powerMode.value = false, 1000)
    }
  }
}

// Pause/Resume
const togglePause = () => {
  isPaused.value = !isPaused.value
  if (!isPaused.value && currentStep.value < steps.value.length) {
    runStep(currentStep.value + 1)
  }
}

// Reset game
const resetGame = () => {
  isRunning.value = false
  isPaused.value = false
  currentStep.value = -1
  score.value = 0
  combo.value = 0
  completedSteps.value = []
  coffeeLevel.value = 100
  powerMode.value = false
}

// Celebration
const celebrate = () => {
  // Create lots of particles
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createParticles(
        { particles: ['🎉', '🎊', '🏆', '⭐', '💫', '🌟', '🥳', '🎯'] },
        window.innerWidth / 2 + (Math.random() - 0.5) * 400,
        window.innerHeight / 2 + (Math.random() - 0.5) * 300
      )
    }, i * 100)
  }
}

// Coffee refill
const refillCoffee = () => {
  coffeeLevel.value = 100
  createParticles(
    { particles: ['☕', '☕', '☕', '💪', '⚡'] },
    window.innerWidth / 2,
    window.innerHeight / 2
  )
}

// Keyboard controls
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case ' ':
      e.preventDefault()
      if (!isRunning.value) {
        startGame()
      } else {
        togglePause()
      }
      break
    case 'r':
    case 'R':
      resetGame()
      break
    case 'c':
    case 'C':
      refillCoffee()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Get step status
const getStepStatus = (index: number) => {
  if (completedSteps.value.includes(index)) return 'complete'
  if (index === currentStep.value) return 'active'
  return 'pending'
}
</script>

<template>
  <Head :title="t('pipeline.title')" />
  
  <div class="min-h-screen bg-background relative overflow-hidden">
    <!-- Animated particles -->
    <div class="fixed inset-0 pointer-events-none">
      <transition-group name="particle">
        <div 
          v-for="particle in particles" 
          :key="particle.id"
          class="absolute text-2xl animate-float"
          :style="{
            left: particle.x + 'px',
            top: particle.y + 'px',
            animation: 'float 2s ease-out forwards'
          }"
        >
          {{ particle.emoji }}
        </div>
      </transition-group>
    </div>

    <!-- Power mode overlay -->
    <transition name="fade">
      <div v-if="powerMode" class="fixed inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-yellow-500/20 animate-pulse"></div>
      </div>
    </transition>

    <!-- Header -->
    <div class="relative z-10 p-4 border-b backdrop-blur-sm bg-background/80">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-6">
          <h1 class="text-2xl font-bold flex items-center gap-2">
            <Sparkles class="h-6 w-6 text-yellow-500" />
            {{ t('pipeline.title') }}
          </h1>
          
          <!-- Score display -->
          <div class="flex items-center gap-4">
            <Badge variant="secondary" class="text-lg px-4 py-2">
              <Star class="h-4 w-4 mr-1" />
              Score: {{ score.toLocaleString() }}
            </Badge>
            <Badge variant="secondary" class="text-lg px-4 py-2">
              <Zap class="h-4 w-4 mr-1" />
              Combo: x{{ combo }}
            </Badge>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Coffee meter -->
          <div class="flex items-center gap-2">
            <Coffee class="h-5 w-5" />
            <div class="w-32 h-6 bg-muted rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500"
                :style="{ width: coffeeLevel + '%' }"
              ></div>
            </div>
            <Button @click="refillCoffee" size="sm" variant="outline">
              Refill ☕
            </Button>
          </div>
          
          <LanguageSelector />
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="relative">
      <Progress :model-value="progress" class="h-3" />
      <div class="absolute inset-0 flex items-center justify-center text-xs font-bold">
        {{ completedSteps.length }} / {{ steps.length }}
      </div>
    </div>

    <!-- Main game area -->
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Controls -->
        <div class="flex justify-center items-center gap-4 mb-8">
          <Button 
            @click="startGame" 
            :disabled="isRunning"
            size="lg"
            class="gap-2"
          >
            <Play class="h-5 w-5" />
            Start Pipeline 🚀
          </Button>
          
          <Button 
            @click="togglePause" 
            :disabled="!isRunning"
            variant="outline"
            size="lg"
            class="gap-2"
          >
            <Pause v-if="!isPaused" class="h-5 w-5" />
            <Play v-else class="h-5 w-5" />
            {{ isPaused ? 'Resume' : 'Pause' }}
          </Button>
          
          <Button 
            @click="resetGame"
            variant="outline"
            size="lg"
            class="gap-2"
          >
            <RotateCcw class="h-5 w-5" />
            Reset
          </Button>
        </div>

        <!-- Pipeline grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            :data-step="index"
            @mouseenter="hoveredStep = index"
            @mouseleave="hoveredStep = null"
            class="relative"
          >
            <transition name="bounce">
              <Card 
                :class="[
                  'transition-all duration-500 cursor-pointer transform',
                  getStepStatus(index) === 'complete' ? 'bg-muted/50 border-muted scale-95' : '',
                  getStepStatus(index) === 'active' ? 'ring-4 ring-primary shadow-2xl scale-110 animate-pulse' : '',
                  getStepStatus(index) === 'pending' ? 'opacity-60 hover:opacity-80' : '',
                  hoveredStep === index && getStepStatus(index) !== 'active' ? 'scale-105' : ''
                ]"
              >
                <CardHeader class="pb-3">
                  <div class="flex items-start justify-between">
                    <span class="text-3xl animate-bounce-slow">{{ step.emoji }}</span>
                    <div class="flex flex-col items-end gap-1">
                      <Badge 
                        :variant="getStepStatus(index) === 'complete' ? 'secondary' : 
                                 getStepStatus(index) === 'active' ? 'default' : 'outline'"
                        class="text-xs"
                      >
                        Step {{ index + 1 }}
                      </Badge>
                      <Badge variant="outline" class="text-xs">
                        +{{ step.points }} pts
                      </Badge>
                    </div>
                  </div>
                  <CardTitle class="text-base mt-2">{{ step.title }}</CardTitle>
                  <CardDescription class="text-xs">{{ step.description }}</CardDescription>
                </CardHeader>
                
                <!-- Expandable content for active step -->
                <transition name="slide">
                  <CardContent v-if="getStepStatus(index) === 'active'" class="pt-0">
                    <div class="bg-muted/50 rounded p-3 mt-2">
                      <pre class="text-xs font-mono whitespace-pre-wrap animate-typewriter">{{ step.example }}</pre>
                    </div>
                  </CardContent>
                </transition>
                
                <!-- Completion checkmark -->
                <transition name="pop">
                  <div v-if="getStepStatus(index) === 'complete'" class="absolute -top-2 -right-2">
                    <div class="bg-green-500 text-white rounded-full p-2 animate-spin-once">
                      ✓
                    </div>
                  </div>
                </transition>
              </Card>
            </transition>
          </div>
        </div>

        <!-- Victory screen -->
        <transition name="fade">
          <div v-if="!isRunning && completedSteps.length === steps.length" class="fixed inset-0 flex items-center justify-center bg-background/90 z-50">
            <Card class="max-w-lg text-center animate-bounce-in">
              <CardHeader>
                <Trophy class="h-24 w-24 text-yellow-500 mx-auto mb-4 animate-spin-slow" />
                <CardTitle class="text-4xl mb-4">🎉 Victory! 🎉</CardTitle>
                <CardDescription class="text-xl">
                  Pipeline Complete!
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="text-2xl font-bold">
                  Final Score: {{ score.toLocaleString() }} / {{ maxScore.toLocaleString() }}
                </div>
                <div class="text-lg">
                  Max Combo: x{{ combo }}
                </div>
                <Button @click="startGame" size="lg" class="mt-4">
                  Play Again 🔄
                </Button>
              </CardContent>
            </Card>
          </div>
        </transition>
      </div>
    </div>

    <!-- Keyboard hints -->
    <div class="fixed bottom-4 left-4 text-xs text-muted-foreground">
      Space: Start/Pause • R: Reset • C: Refill Coffee
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(1.5);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin-once {
  0% {
    transform: rotate(0deg) scale(0);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

.animate-spin-once {
  animation: spin-once 0.5s ease-out;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

.animate-typewriter {
  overflow: hidden;
  white-space: nowrap;
  animation: typewriter 1s steps(40) forwards;
}

/* Transitions */
.particle-enter-active,
.particle-leave-active {
  transition: all 0.3s ease;
}

.particle-enter-from {
  opacity: 0;
  transform: scale(0);
}

.particle-leave-to {
  opacity: 0;
  transform: scale(2);
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.pop-enter-active {
  animation: spin-once 0.5s;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  max-height: 0;
}

.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw } from 'lucide-vue-next'
import LanguageSelector from '@/components/LanguageSelector.vue'

const { t } = useI18n()

// Pipeline steps data
const steps = computed(() => [
    {
        id: 1,
        emoji: '🎬',
        title: t('pipeline.steps.1.title'),
        description: t('pipeline.steps.1.description'),
        example: t('pipeline.steps.1.example'),
        duration: 2000
    },
    {
        id: 2,
        emoji: '📖',
        title: t('pipeline.steps.2.title'),
        description: t('pipeline.steps.2.description'),
        example: t('pipeline.steps.2.example'),
        duration: 3000
    },
    {
        id: 3,
        emoji: '🔍',
        title: t('pipeline.steps.3.title'),
        description: t('pipeline.steps.3.description'),
        example: t('pipeline.steps.3.example'),
        duration: 3000
    },
    {
        id: 4,
        emoji: '📐',
        title: t('pipeline.steps.4.title'),
        description: t('pipeline.steps.4.description'),
        example: t('pipeline.steps.4.example'),
        duration: 3000
    },
    {
        id: 5,
        emoji: '🔄',
        title: t('pipeline.steps.5.title'),
        description: t('pipeline.steps.5.description'),
        example: t('pipeline.steps.5.example'),
        duration: 3000
    },
    {
        id: 6,
        emoji: '📍',
        title: t('pipeline.steps.6.title'),
        description: t('pipeline.steps.6.description'),
        example: t('pipeline.steps.6.example'),
        duration: 3000
    },
    {
        id: 7,
        emoji: '⚡',
        title: t('pipeline.steps.7.title'),
        description: t('pipeline.steps.7.description'),
        example: t('pipeline.steps.7.example'),
        duration: 3000
    },
    {
        id: 8,
        emoji: '🔧',
        title: t('pipeline.steps.8.title'),
        description: t('pipeline.steps.8.description'),
        example: t('pipeline.steps.8.example'),
        duration: 3000
    },
    {
        id: 9,
        emoji: '🤖',
        title: t('pipeline.steps.9.title'),
        description: t('pipeline.steps.9.description'),
        example: t('pipeline.steps.9.example'),
        duration: 3000
    },
    {
        id: 10,
        emoji: '✨',
        title: t('pipeline.steps.10.title'),
        description: t('pipeline.steps.10.description'),
        example: t('pipeline.steps.10.example'),
        duration: 3000
    },
    {
        id: 11,
        emoji: '🛡️',
        title: t('pipeline.steps.11.title'),
        description: t('pipeline.steps.11.description'),
        example: t('pipeline.steps.11.example'),
        duration: 3000
    },
    {
        id: 12,
        emoji: '🎉',
        title: t('pipeline.steps.12.title'),
        description: t('pipeline.steps.12.description'),
        example: t('pipeline.steps.12.example'),
        duration: 2000
    }
])

// State management
const currentStep = ref(-1)
const isRunning = ref(false)
const isPaused = ref(false)
const progress = ref(0)
const activeCard = ref<number | null>(null)

// Start the demo
const startDemo = () => {
    isRunning.value = true
    isPaused.value = false
    currentStep.value = 0
    runStep(0)
}

// Run a single step
const runStep = (index: number) => {
    if (!isRunning.value || isPaused.value) return
    
    if (index >= steps.value.length) {
        // Demo complete
        isRunning.value = false
        return
    }
    
    currentStep.value = index
    activeCard.value = index
    progress.value = ((index + 1) / steps.value.length) * 100
    
    // Simulate processing time
    setTimeout(() => {
        if (isRunning.value && !isPaused.value) {
            runStep(index + 1)
        }
    }, steps.value[index].duration)
}

// Control functions
const pauseDemo = () => {
    isPaused.value = !isPaused.value
    if (!isPaused.value && currentStep.value < steps.value.length) {
        runStep(currentStep.value + 1)
    }
}

const resetDemo = () => {
    isRunning.value = false
    isPaused.value = false
    currentStep.value = -1
    progress.value = 0
    activeCard.value = null
}

// Get card status
const getCardStatus = (index: number) => {
    if (index < currentStep.value) return 'complete'
    if (index === currentStep.value) return 'active'
    return 'pending'
}
</script>

<template>
    <Head :title="t('pipeline.title')" />
    
    <div class="min-h-screen bg-background p-4 md:p-8">
        <!-- Language selector in top right -->
        <div class="absolute top-4 right-4">
            <LanguageSelector />
        </div>
        
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">{{ t('pipeline.title') }}</h1>
                <p class="text-xl">{{ t('pipeline.subtitle') }}</p>
            </div>

            <!-- Controls -->
            <div class="flex justify-center items-center gap-4 mb-4">
                <Button 
                    @click="startDemo" 
                    :disabled="isRunning && !isPaused"
                    size="sm"
                    class="gap-2"
                >
                    <Play class="h-4 w-4" />
                    {{ t('pipeline.controls.start') }}
                </Button>
                <Button 
                    @click="pauseDemo" 
                    :disabled="!isRunning"
                    variant="outline"
                    size="sm"
                    class="gap-2"
                >
                    <Pause v-if="!isPaused" class="h-4 w-4" />
                    <Play v-else class="h-4 w-4" />
                    {{ isPaused ? t('pipeline.controls.resume') : t('pipeline.controls.pause') }}
                </Button>
                <Button 
                    @click="resetDemo"
                    variant="outline"
                    size="sm"
                    class="gap-2"
                >
                    <RotateCcw class="h-4 w-4" />
                    {{ t('pipeline.controls.reset') }}
                </Button>
                
                <!-- Link to game mode -->
                <Link href="/pipeline-game" class="ml-4">
                    <Button variant="default" size="sm" class="gap-2">
                        🎮 Game Mode
                    </Button>
                </Link>
            </div>

            <!-- Progress Bar -->
            <Progress :model-value="progress" class="w-full h-2" />

            <!-- Pipeline Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Card 
                    v-for="(step, index) in steps" 
                    :key="step.id"
                    :class="[
                        'transition-all duration-500 cursor-pointer',
                        getCardStatus(index) === 'complete' ? 'bg-muted/50 border-muted' : '',
                        getCardStatus(index) === 'active' ? 'ring-2 ring-primary shadow-lg scale-105' : '',
                        getCardStatus(index) === 'pending' ? 'opacity-60' : ''
                    ]"
                    @click="activeCard = activeCard === index ? null : index"
                >
                    <CardHeader class="pb-3">
                        <div class="flex items-start justify-between">
                            <span class="text-2xl">{{ step.emoji }}</span>
                            <Badge 
                                :variant="getCardStatus(index) === 'complete' ? 'secondary' : 
                                         getCardStatus(index) === 'active' ? 'default' : 'outline'"
                                class="text-xs"
                            >
                                {{ index + 1 }}
                            </Badge>
                        </div>
                        <CardTitle class="text-lg font-semibold">{{ step.title }}</CardTitle>
                        <CardDescription class="text-sm">{{ step.description }}</CardDescription>
                    </CardHeader>
                    
                    <!-- Expandable content -->
                    <CardContent v-if="activeCard === index" class="pt-0">
                        <div class="bg-muted/50 rounded p-3 mt-2">
                            <pre class="text-sm font-mono whitespace-pre-wrap font-semibold">{{ step.example }}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Status Message -->
            <div v-if="currentStep >= 0" class="text-center">
                <p class="text-lg font-medium">
                    {{ currentStep < steps.value.length ? t('pipeline.status.processing', { step: steps.value[currentStep].title }) : t('pipeline.status.complete') }}
                </p>
            </div>
        </div>
    </div>
</template>
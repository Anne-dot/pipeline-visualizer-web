<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { GraduationCap, Wrench, Code, Presentation } from 'lucide-vue-next'
import LanguageSelector from '@/components/LanguageSelector.vue'

const { t } = useI18n()
</script>

<template>
    <Head :title="t('app.title')" />
    
    <div class="min-h-screen bg-background p-4 sm:p-6 md:p-8 overflow-y-auto">
        <!-- Language selector in top right -->
        <div class="absolute top-4 right-4 z-10">
            <LanguageSelector />
        </div>
        
        <div class="w-full max-w-7xl mx-auto space-y-6">
            <!-- Main Title Card - Responsive -->
            <Card class="border-2 w-full">
                <CardHeader class="text-center p-4 sm:p-6 md:p-8 lg:p-10">
                    <div class="flex justify-center mb-4">
                        <GraduationCap class="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-foreground" />
                    </div>
                    <CardTitle class="responsive-title font-bold mb-4 leading-tight">
                        {{ t('app.title') }}
                    </CardTitle>
                    <div class="mt-4 md:mt-6 space-y-3">
                        <h2 class="responsive-name font-bold">{{ t('app.studentName') }}</h2>
                        <div class="flex flex-wrap justify-center gap-2">
                            <Badge variant="secondary" class="text-sm sm:text-base px-3 py-1">{{ t('app.author') }}</Badge>
                            <Badge variant="secondary" class="text-sm sm:text-base px-3 py-1">{{ t('app.school') }}</Badge>
                        </div>
                        <div class="flex justify-center gap-4 mt-6">
                            <Link href="/slideshow">
                                <Button size="lg" class="gap-2">
                                    <Presentation class="h-5 w-5" />
                                    Esitlus
                                </Button>
                            </Link>
                            <Link href="/pipeline">
                                <Button size="lg" variant="outline" class="gap-2">
                                    <Code class="h-5 w-5" />
                                    Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <!-- Project Overview -->
            <div class="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2 mb-2">
                            <Wrench class="h-6 w-6" />
                            <CardTitle class="text-xl">{{ t('presentation.toolManagement.title') }}</CardTitle>
                        </div>
                        <CardDescription>
                            {{ t('presentation.toolManagement.description') }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul class="space-y-3 text-base font-medium">
                            <li>• {{ t('presentation.toolManagement.features.csv') }}</li>
                            <li>• {{ t('presentation.toolManagement.features.sync') }}</li>
                            <li>• {{ t('presentation.toolManagement.features.backup') }}</li>
                            <li>• {{ t('presentation.toolManagement.features.vbscript') }}</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div class="flex items-center gap-2 mb-2">
                            <Code class="h-6 w-6" />
                            <CardTitle class="text-xl">{{ t('presentation.dxfToGcode.title') }}</CardTitle>
                        </div>
                        <CardDescription>
                            {{ t('presentation.dxfToGcode.description') }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul class="space-y-3 text-base font-medium">
                            <li>• {{ t('presentation.dxfToGcode.features.parse') }}</li>
                            <li>• {{ t('presentation.dxfToGcode.features.transform') }}</li>
                            <li>• {{ t('presentation.dxfToGcode.features.optimize') }}</li>
                            <li>• {{ t('presentation.dxfToGcode.features.safety') }}</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <!-- About Section -->
            <Card>
                <CardHeader>
                    <CardTitle class="text-xl">{{ t('presentation.about.title') }}</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <p class="text-lg leading-relaxed">
                        {{ t('presentation.about.description1') }}
                    </p>
                    <p class="text-lg leading-relaxed">
                        {{ t('presentation.about.description2') }}
                    </p>
                </CardContent>
            </Card>

        </div>
    </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLanguage } from '@/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-vue-next'

const { locale } = useI18n()

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' }
]

const currentLanguage = languages.find(lang => lang.code === locale.value) || languages[0]

const changeLanguage = (lang: string) => {
  setLanguage(lang)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="gap-2">
        <Globe class="h-4 w-4" />
        <span>{{ currentLanguage.flag }} {{ currentLanguage.name }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem 
        v-for="lang in languages" 
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        :class="{ 'bg-muted': lang.code === locale }"
      >
        <span class="mr-2">{{ lang.flag }}</span>
        {{ lang.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
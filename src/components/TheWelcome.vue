<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Tracking</template>
    <p>
      Keep full control of your grow cycles. The Grow Planner helps you
      <strong>track vegetation and bloom phases</strong>,
      automatically calculate your <strong>estimated harvest date</strong>,
      and visualize the progress of each individual plant.
    </p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Plants</template>

    Manage all your plants in one place.
    Whether it’s <strong>cannabis, herbs, or other plants</strong>,
    you can store details like start date, phase, nutrients, and custom notes.
    Everything stays synced with your account so you never lose your data.

    <br>

    More instructions are available in
    <a href="javascript:void(0)" @click="openReadmeInEditor"><code>README.md</code></a
    >.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Bloom and Vegetation phase</template>

    Clearly separate vegetation and bloom phases
    to fine-tune your lighting, feeding, and watering schedule.
    The planner automatically suggests when to switch to bloom mode
    based on your current cycle and inputs.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Harvest</template>

    Know exactly when your plants are ready to harvest.
    Thanks to automatic phase tracking, you get a realistic
    harvest estimate and can compare your cycles over time
    to improve each future grow.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Project</template>

    The Grow Planner is an independent project
    built to make cultivation more efficient and data-driven.
    You can support development by contributing feedback, ideas, or code
    and help make this tool even better for every grower. 🌱
    <br>
    You can help me by
    <a href="https://buymeacoffee.com/xn4k" target="_blank" rel="noopener">becoming a sponsor</a>.
  </WelcomeItem>
</template>

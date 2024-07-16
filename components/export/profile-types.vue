<template>
  <div class="content">
    {{ $gettext("Liste des profils et de leurs conditions :") }}
    <ul>
      <li
        v-for="profileType in profilingStore.profileTypes"
        :key="profileType.id"
      >
        "{{ profileType.name }}",
        <template v-if="profileType.rulesIntersectionOperator == 'and'">
          {{ $gettext("vous devez respecter toutes les conditions suivantes :") }}
        </template>
        <template v-else>
          {{ $gettext("vous devez respecter au moins une des les conditions suivantes :") }}
        </template>
        <ul>
          <li
            v-for="rule in profileType.rules"
            :key="rule.id"
          >
            {{ rule.explanation }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useProfilingStore } from "~/stores/profilingStore"

const profilingStore = useProfilingStore()
</script>

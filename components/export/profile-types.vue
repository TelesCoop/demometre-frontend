<template>
  <div class="content">
    Liste des profils et de leurs conditions :
    <ul>
      <li
        v-for="profileType in profilingStore.profileTypes"
        :key="profileType.id"
      >
        "{{ profileType.name }}", vous devez respecter
        {{
          profileType.rulesIntersectionOperator == "and"
            ? "toutes les"
            : "au moins une des"
        }}
        conditions suivantes :
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

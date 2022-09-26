import Rollbar from "rollbar"

export default defineNuxtPlugin((nuxtApp) => {
  const rollbarInstance = new Rollbar({
    accessToken: process.env.ROLLBAR_POST_CLIENT_ITEM_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      // Track your events to a specific version of code for better visibility into version health
      // code_version: "1.0.0",
      // Add custom data to your events by adding custom key/value pairs like the one below
      // custom_data: "foo",
    },
  })

  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rollbarInstance.error(error)
    throw error
  }

  return {
    provide: {
      rollbar: rollbarInstance,
    },
  }
})

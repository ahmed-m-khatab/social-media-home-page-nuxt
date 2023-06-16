export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const api = url => $axios.create({
    baseURL: url
  })

  // Inject to context as $api
  inject('api', api)
}
  
export async function loadAllPages(list) {
  let page = 1
  let payload = await list()

  if (Array.isArray(payload)) return payload

  const items = [...payload.results]
  while (payload.next) {
    page += 1
    payload = await list({ page })
    items.push(...payload.results)
  }
  return items
}



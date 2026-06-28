import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.vuejs.org/config/app-configs
export default withMermaid(
  defineConfig({
    mermaid: {}
  })
)

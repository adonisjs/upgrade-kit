exports[`Integrations > All plugins 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to import and register when booting the
  | application
  |
  */
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/http_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    {
      file: () => import('@adonisjs/core/providers/repl_provider'),
      environment: [\\"repl\\", \\"test\\"],
    }
  ]
});
"`


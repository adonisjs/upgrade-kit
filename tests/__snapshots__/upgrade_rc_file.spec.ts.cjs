exports[`Upgrade rc file > migrate commands 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register from packages. The application commands
  | will be scanned automatically from the \\"./commands\\" directory.
  |
  */
  commands: [() => import('@foo/bar/commands'), () => import('@bar/foo/build/commands')]
});
"`

exports[`Upgrade rc file > should remove ./commands since it is not needed anymore 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({});
"`

exports[`Upgrade rc file > migrate preloads files 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [
    () => import('./foo/bar.js'),
    () => import('./bar/foo.js')
  ]
});
"`

exports[`Upgrade rc file > keep environments while migrating preload files 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [
    {
      file: () => import('./foo/bar'),
      environment: [\\"web\\"],
    },
    {
      file: () => import('./bar/foo'),
      environment: [\\"console\\", \\"repl\\"],
    },
    () => import('./hello.js')
  ]
});
"`

exports[`Upgrade rc file > migrate providers 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

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
    () => import('@adonisjs/foo'),
    () => import('@adonisjs/bar')
  ]
});
"`

exports[`Upgrade rc file > replace adonisjs/core with new providers 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

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

exports[`Upgrade rc file > replace old providers with new one 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

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
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/view/views_provider'),
    () => import('@adonisjs/redis/redis_provider')
  ]
});
"`

exports[`Upgrade rc file > migrate directories 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  directories: {
    \\"config\\": \\"config\\",
    \\"public\\": \\"public\\"
  }
});
"`

exports[`Upgrade rc file > migrate meta files 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  metaFiles: [
    {
      \\"pattern\\": \\"foo/bar\\",
      \\"reloadServer\\": true
    }
  ]
});
"`

exports[`Upgrade rc file > migrate tests suites 1`] = `"import { defineConfig } from \\"@adonisjs/core/app\\";

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  |
  | List of test suites to organize tests by their type. Feel free to remove
  | and add additional suites.
  |
  */
  tests: {
    \\"suites\\": [
      {
        \\"files\\": [
          \\"tests/unit/**/*.spec(.ts|.js)\\"
        ],
        \\"name\\": \\"unit\\",
        \\"timeout\\": 60000
      }
    ]
  }
});
"`


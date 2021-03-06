# github-stats-dashboard
Angular-based GitHub Stats Dashboard

See it [live](https://lybekk.tech/github-stats-dashboard/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

> *Note: Bug [#119](https://github.com/angular-schule/angular-cli-ghpages/issues/119) in angular gh pages prevents deployment using `ng deploy`. Use the following procedure instead*
> 1. `ng build --prod --base-href /github-stats-dashboard/`
> 2. `npx angular-cli-ghpages --dir=dist/gh-stats`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Resources

[ng bootstragp](https://ng-bootstrap.github.io/#/home)

[Bootstrap CSS](https://getbootstrap.com/docs/4.5/layout/overview/)

[GitHub GraphQL Explorer](https://developer.github.com/v4/explorer/)

[GitHub GraphQL API docs](https://docs.github.com/en/free-pro-team@latest/graphql/guides/introduction-to-graphql)

[GitHub REST API docs](https://docs.github.com/en/free-pro-team@latest/rest/guides/getting-started-with-the-rest-api)

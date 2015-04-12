# Dynamic, flexible and accessible AngularJS tabs.

  - Easy to use and customize
  - Keyboard accessible
  - Works with (or without) `ng-repeat`

## Demos

  - [GitHub](http://lukaszwatroba.github.io/v-tabs)


## Usage

  - If you use [bower](http://bower.io/) or [npm](https://www.npmjs.com/), just `bower/npm install v-tabs`. If not, download files [from the github repo](./dist).

  - Include `angular.js`, `angular-animate.js`, `v-tabs.js`, and `v-tabs.css`:
  ```html
  <link href="v-tabs.css" rel="stylesheet" />

  <script src="angular.js"></script>
  <script src="angular-animate.js"></script>

  <script src="v-tabs.js"></script>
  ```

  - Add `ngAnimate` and `vTabs` as dependencies to your application module:
  ```js
  var myApp = angular.module('myApp', ['ngAnimate', 'vTabs']);
  ```

  - And put the following markup in your template:
  ```html
  <v-tabs class="vTabs--default" horizontal active="activeTabIndex">
    <v-tab>Tab 1</v-tab>
    <v-tab>Tab 2</v-tab>
    <v-tab>Tab 3</v-tab>
  </v-tabs>

  <v-pages class="vPages--default" active="activeTabIndex">
    <v-page>
      <h3>Page 1</h3>
      <p>Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis.</p>
    </v-page>
    <v-page>
      <h3>Page 2</h3>
      <p>Maecenas malesuada elit lectus felis, malesuada ultricies.</p>
    </v-page>
    <v-page>
      <h3>Page 3</h3>
      <p>Curabitur et ligula. Ut molestie a, ultricies porta urna.</p>
    </v-page>
  </v-pages>
  ```

  - You can also use `v-tabs` with `ng-repeat`:
  ```html
  <v-tabs class="vTabs--default" horizontal active="activeTabIndex">
    <v-tab ng-repeat="page in pages" ng-bind="page.title"></v-tab>
  </v-tabs>

  <v-pages class="vPages--default" active="activeTabIndex">
    <v-page ng-repeat="page in pages" ng-bind="page.content"></v-page>
  </v-pages>
  ```


## API

Add the `control` attribute to use API methods:

```html
<v-tabs class="vTabs--default" control="tabs" active="tabs.active">
  <v-tab ng-repeat="page in pages" ng-bind="page.title"></v-tab>
</v-tabs>

<v-pages class="vPages--default" active="tabs.active" ng-swipe-left="tabs.next()" ng-swipe-right="tabs.previous()">
  <v-page ng-repeat="page in pages" ng-bind="page.content"></v-page>
</v-pages>

<button type="button" ng-click="tabs.previous()">Previous</button>
<button type="button" ng-click="tabs.next()">Next</button>
```

#### Methods

  - `activate(index)`
  - `next()`
  - `previous()`


## Accessibility
vTabs manages keyboard focus and adds some common aria-* attributes. BUT you should additionally place the `aria-controls` and `aria-labelledby`:

```html
<v-tabs class="vTabs--default" horizontal control="tabs" active="tabs.active">
  <v-tab id="tab0{{$index}}" aria-controls="page0{{$index}}" ng-repeat="page in pages" ng-bind="page.title"></v-tab>
</v-tabs>

<v-pages class="vPages--default" active="tabs.active" ng-swipe-left="tabs.next()" ng-swipe-right="tabs.previous()">
  <v-page id="page0{{$index}}" aria-labelledby="tab0{{$index}}" ng-repeat="page in pages" ng-bind="page.content"></v-page>
</v-pages>
```

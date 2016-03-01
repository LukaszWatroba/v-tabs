describe('vPage directive', function () {

  var $compile;
  var $rootScope;
  var tabsConfig;
  var scope;


  var generatePages = function (length) {
    var samplePages = [];

    for (var i = 0; i < length; i++) {
      var samplePage = {
        content: 'Page #' + i
      };

      samplePages.push(samplePage);
    }

    return samplePages;
  };

  var generateTemplate = function (options) {
    var defaults = {
      attributes: '',
      content: ''
    };

    if (options) {
      angular.extend(defaults, options);
    }

    var template = '<v-pages>\n';
        template += '<v-page ' + defaults.attributes + '>\n';
        template += defaults.content + '\n';
        template += '</v-page>\n';
        template += '</v-pages>';

    return template;
  };



  beforeEach(module('vTabs'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _pagesConfig_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
    pagesConfig = _pagesConfig_;
  }));

  afterEach(function () {
    scope.$destroy();
  });



  it('should throw an error if `v-pages` directive controller can\'t be found', function () {
    var template = '<v-page></v-page>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should set tab `internalControl` as `$page` property on transcluded scope', function () {
    var options = { attributes: 'id="page"', content: '<span></span>' };
    var template = generateTemplate(options);

    var pages = $compile(template)(scope);
    var content = pages.find('span');
    var transcludedScope = content.scope();

    expect(scope.$page).not.toBeDefined();
    expect(transcludedScope.$page.id).toEqual('page');
    expect(transcludedScope.$page.activate).toBeDefined();
    expect(transcludedScope.$page.isActive).toBeDefined();
  });


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ content: '{{ message }}' });
    var pages = $compile(template)(scope);

    scope.message = message;
    scope.$digest();

    expect(pages.html()).toContain(message);
  });


  it('should set ARIA attributes', function () {
    var template = generateTemplate();
    var pages = $compile(template)(scope);
    var page = pages.find('v-page');

    scope.$digest();

    expect(page.attr('role')).toBe('tabpanel');
  });


  it('should set `isDisabled` scope property to `true` if `disabled` attribute is defined', function () {
    var options = { attributes: 'disabled' };
    var template = generateTemplate(options);

    var pages = $compile(template)(scope);
    var page = pages.find('v-page');
    var isolateScope = page.isolateScope();

    expect(isolateScope.isDisabled).toBe(true);
  });


  it('should works with `ng-repeat` directive', function () {
    var length = 3;

    var template =  '<v-pages>\n' +
                    '  <v-page ng-repeat="page in pages">\n' +
                    '    {{ page.content }}\n' +
                    '  </v-page>\n' +
                    '</v-pages>';

    var pages = $compile(template)(scope);

    scope.pages = generatePages(length);
    scope.$digest();

    expect(pages.find('v-page').length).toEqual(length);
  });


  it('should activate using `$page` transcluded scope property methods', function () {
    var template = generateTemplate({ content: '<span></span>' });

    var pages = $compile(template)(scope);
    var page = pages.find('v-page');
    var $page = page.find('span').scope().$page;
    var isolateScope = page.isolateScope();

    expect($page.isActive()).toBe(false);
    $page.activate();
    expect($page.isActive()).toBe(true);
  });

});

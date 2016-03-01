describe('vPages directive', function () {

  var $compile;
  var $rootScope;
  var pagesConfig;
  var scope;


  var generateTemplate = function (options) {
    var defaults = {
      attributes: '',
      content: ''
    };

    if (options) {
      angular.extend(defaults, options);
    }

    var template = '<v-pages ' + defaults.attributes + '>\n';
        template += defaults.content + '\n';
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


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ content: '{{ message }}' });
    var pages = $compile(template)(scope);

    scope.message = message;
    scope.$digest();

    expect(pages.html()).toContain(message);
  });


  it('should extend custom control object', function () {
    var options = { attributes: 'control="control"' };

    scope.control = { foo: 'bar' };

    var template = generateTemplate(options);
    var pages = $compile(template)(scope);

    expect(pages.isolateScope().internalControl.foo).toBeDefined();
    expect(pages.isolateScope().internalControl.foo).toBe('bar');
  });


  it('should throw an error if the API method is overriden', function () {
    var options = { attributes: 'control="control"' };
    var template = generateTemplate(options);

    scope.control = { activate: function () {} };

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should set pages `internalControl` as `$pages` property on transcluded scope', function () {
    var options = { attributes: 'id="test"', content: '<v-page></v-page>' };
    var template = generateTemplate(options);

    var pages = $compile(template)(scope);
    var page = pages.find('v-page');
    var transcludedScope = page.scope();

    expect(scope.$pages).not.toBeDefined();
    expect(transcludedScope.$pages).toBeDefined();
    expect(transcludedScope.$pages.id).toEqual('test');
    expect(transcludedScope.$pages.next).toBeDefined();
    expect(transcludedScope.$pages.previous).toBeDefined();
    expect(transcludedScope.$pages.activate).toBeDefined();
  });


  it('should change `activeIndex` property using `$pages` methods', function () {
    var template =  '<v-pages>\n' +
                    '  <v-page id="page1"></v-page>\n' +
                    '  <v-page id="page2"></v-page>\n' +
                    '</v-pages>\n';

    var pages = $compile(template)(scope);
    var $pages = pages.find('v-page').first().scope().$pages;
    var isolateScope = pages.isolateScope();

    expect(isolateScope.activeIndex).toBe(0);
    $pages.activate(1);
    expect(isolateScope.activeIndex).toBe(1);
    $pages.activate('page1');
    expect(isolateScope.activeIndex).toBe(0);
    $pages.next();
    expect(isolateScope.activeIndex).toBe(1);
    $pages.previous();
    expect(isolateScope.activeIndex).toBe(0);
  });


  it('should set `activeIndex` to 0 if `active` attribute is not set', function () {
    var template = generateTemplate();
    var pages = $compile(template)(scope);

    expect(pages.isolateScope().activeIndex).toBe(0);
  });


  it('should bind `active` attribute value to `activeIndex` isolated scope property', function () {
    var activeIndex = 2;

    var options = { attributes: 'active="activeIndex"' };
    var template = generateTemplate(options);

    scope.activeIndex = activeIndex;
    var pages = $compile(template)(scope);

    expect(pages.isolateScope().activeIndex).toBe(activeIndex);
  });


});

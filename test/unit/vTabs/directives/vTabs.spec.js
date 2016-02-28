describe('vTabs directive', function () {

  var $compile;
  var $rootScope;
  var tabsConfig;
  var scope;


  var generateTemplate = function (options) {
    var defaults = {
      attributes: '',
      content: ''
    };

    if (options) {
      angular.extend(defaults, options);
    }

    var template = '<v-tabs ' + defaults.attributes + '>\n';
        template += defaults.content + '\n';
        template += '</v-tabs>';

    return template;
  };


  beforeEach(module('vTabs'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _tabsConfig_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
    tabsConfig = _tabsConfig_;
  }));

  afterEach(function () {
    scope.$destroy();
  });


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ content: '{{ message }}' });
    var tabs = $compile(template)(scope);

    scope.message = message;
    scope.$digest();

    expect(tabs.html()).toContain(message);
  });


  it('should extend custom control object', function () {
    var options = { attributes: 'control="control"' };

    scope.control = { foo: 'bar' };

    var template = generateTemplate(options);
    var tabs = $compile(template)(scope);

    expect(tabs.isolateScope().internalControl.foo).toBeDefined();
    expect(tabs.isolateScope().internalControl.foo).toBe('bar');
  });


  it('should throw an error if the API method is overriden', function () {
    var options = { attributes: 'control="control"' };
    var template = generateTemplate(options);

    scope.control = { activate: function () {} };

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should set accordion `internalControl` as `$tabs` property on transcluded scope', function () {
    var options = { attributes: 'id="test"', content: '<v-tab></v-tab>' };
    var template = generateTemplate(options);

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var transcludedScope = tab.scope();

    expect(scope.$tabs).not.toBeDefined();
    expect(transcludedScope.$tabs).toBeDefined();
    expect(transcludedScope.$tabs.id).toEqual('test');
    expect(transcludedScope.$tabs.next).toBeDefined();
    expect(transcludedScope.$tabs.previous).toBeDefined();
    expect(transcludedScope.$tabs.activate).toBeDefined();
  });


  it('should set `activeIndex` to 0 if `active` attribute is not set', function () {
    var template = generateTemplate();
    var tabs = $compile(template)(scope);

    expect(tabs.isolateScope().activeIndex).toBe(0);
  });


  it('should bind `active` attribute value to `activeIndex` isolated scope property', function () {
    var activeIndex = 2;

    var options = { attributes: 'active="activeIndex"' };
    var template = generateTemplate(options);

    scope.activeIndex = activeIndex;
    var tabs = $compile(template)(scope);

    expect(tabs.isolateScope().activeIndex).toBe(activeIndex);
  });


});

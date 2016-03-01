describe('vTab directive', function () {

  var $compile;
  var $rootScope;
  var tabsConfig;
  var scope;


  var generateTabs = function (length) {
    var sampleTabs = [];

    for (var i = 0; i < length; i++) {
      var sampleTab = {
        title: 'Tab #' + i
      };

      sampleTabs.push(sampleTab);
    }

    return sampleTabs;
  };

  var generateTemplate = function (options) {
    var defaults = {
      attributes: '',
      content: ''
    };

    if (options) {
      angular.extend(defaults, options);
    }

    var template = '<v-tabs>\n';
        template += '<v-tab ' + defaults.attributes + '>\n';
        template += defaults.content + '\n';
        template += '</v-tab>\n';
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



  it('should throw an error if `v-tabs` directive controller can\'t be found', function () {
    var template = '<v-tab></v-tab>';

    expect(function () { $compile(template)(scope); }).toThrow();
  });


  it('should set tab `internalControl` as `$tab` property on transcluded scope', function () {
    var options = { attributes: 'id="tab"', content: '<span></span>' };
    var template = generateTemplate(options);

    var tabs = $compile(template)(scope);
    var content = tabs.find('span');
    var transcludedScope = content.scope();

    expect(scope.$tab).not.toBeDefined();
    expect(transcludedScope.$tab.id).toEqual('tab');
    expect(transcludedScope.$tab.activate).toBeDefined();
    expect(transcludedScope.$tab.isActive).toBeDefined();
  });


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ content: '{{ message }}' });
    var tabs = $compile(template)(scope);

    scope.message = message;
    scope.$digest();

    expect(tabs.html()).toContain(message);
  });


  it('should set ARIA attributes', function () {
    var template = generateTemplate();
    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');

    scope.$digest();

    expect(tab.attr('role')).toBe('tab');
    expect(tab.attr('aria-selected')).toBe('false');
    expect(tab.attr('tabindex')).toBe('-1');
  });


  it('should set `isInactive` scope property to `true` if `inactive` attribute is defined', function () {
    var options = { attributes: 'inactive' };
    var template = generateTemplate(options);

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var isolateScope = tab.isolateScope();

    expect(isolateScope.isInactive).toBe(true);
  });


  it('should set `isInactive` scope property to `true` if `inactive` attribute is defined', function () {
    var options = { attributes: 'inactive' };
    var template = generateTemplate(options);

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var isolateScope = tab.isolateScope();

    expect(isolateScope.isInactive).toBe(true);
  });


  it('should set `isDisabled` scope property to `true` if `disabled` attribute is defined', function () {
    var options = { attributes: 'disabled' };
    var template = generateTemplate(options);

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var isolateScope = tab.isolateScope();

    expect(isolateScope.isDisabled).toBe(true);
  });


  it('should activate on click', function () {
    var template = generateTemplate();

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var isolateScope = tab.isolateScope();

    tab.click();
    scope.$digest();

    expect(isolateScope.isActive).toBe(true);
    expect(tab.hasClass(tabsConfig.states.active)).toBe(true);
    expect(tab.attr('aria-selected')).toBe('true');
    expect(tab.attr('tabindex')).toBe('0');
  });


  it('should not activate on click when isDisabled or isInactive propertie is true', function () {
    var options = { attributes: 'inactive' };
    var template = generateTemplate(options);

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var isolateScope = tab.isolateScope();

    tab.click();
    scope.$digest();

    expect(isolateScope.isActive).toBeFalsy();
    expect(tab.hasClass(tabsConfig.states.active)).toBe(false);
    expect(tab.attr('aria-selected')).toBe('false');
    expect(tab.attr('tabindex')).toBe('-1');
  });


  it('should works with `ng-repeat` directive', function () {
    var length = 3;

    var template =  '<v-tabs>\n' +
                    '  <v-tab ng-repeat="tab in tabs">\n' +
                    '    {{ tab.title }}\n' +
                    '  </v-tab>\n' +
                    '</v-tabs>';

    var tabs = $compile(template)(scope);

    scope.tabs = generateTabs(length);
    scope.$digest();

    expect(tabs.find('v-tab').length).toEqual(length);
  });


  it('should activate using `$tab` transcluded scope property methods', function () {
    var template = generateTemplate({ content: '<span></span>' });

    var tabs = $compile(template)(scope);
    var tab = tabs.find('v-tab');
    var $tab = tab.find('span').scope().$tab;
    var isolateScope = tab.isolateScope();

    expect($tab.isActive()).toBe(false);
    $tab.activate();
    expect($tab.isActive()).toBe(true);
  });

});

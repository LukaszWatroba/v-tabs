describe('vTab directive', function () {

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


  it('should transclude scope', function () {
    var message = 'Hello World!';

    var template = generateTemplate({ content: '{{ message }}' });
    var tabs = $compile(template)(scope);

    scope.message = message;
    scope.$digest();

    expect(tabs.html()).toContain(message);
  });

});

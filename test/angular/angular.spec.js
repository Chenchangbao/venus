describe('Users', () => {
  var snMarkdownFilter, rootScope;
  
  beforeEach(
    window.module('app')
  );

  beforeEach(
    window.inject(($injector) => {
      rootScope = $injector.get('$rootScope');
      snMarkdownFilter = $injector.get('snMarkdownFilter');
      var $controller = $injector.get('$controller');
    })
  );

  describe('Service', () => {
    // component/directive specs
    it('the name property has the correct value', () => {
      console.info(snMarkdownFilter);
      expect({name: 'qiaoliang'}.name).to.equal('qiaoliang');
    });

    it('has property: name' ,() => {
      expect({name: 'qiaoliang'}).to.have.property('name');
    });
  });
});

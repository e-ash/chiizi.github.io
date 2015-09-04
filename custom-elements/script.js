var XMeepProto = Object.create(HTMLElement.prototype{
  createdCallback: {
    value: function() {
      var t = document.querySelector("#meep-style");
      var clone = document.importNode(t.content, true);
      this.createShadowRoot().appendChild(clone);
    }
  }
});

XMeepProto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = "hello.";
};

var XMeep = document.registerElement("x-meep", {prototype: XMeepProto});

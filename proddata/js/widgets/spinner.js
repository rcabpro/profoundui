//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2020 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.




/**
 * Spinner Class
 * Note: this widget is used in Designer's binding dialogs, so be careful to test those when making changes.
 *       This rendering code is not used for the actual spinner widget in Designer; there is code in DesignItem doing that.
 * @constructor
 * @param {Element} dom
 * @param {String|Number} minValue
 * @param {String|Number} maxValue
 * @param {String|Number} increment
 * @param {Boolean} runtimeMode
 * @returns {pui.Spinner}
 * 
 * TODO: figure out why the Spinner class is constructed in a timeout, causing property setters to use timeouts.
 *   There must be a better way.
 */
pui.Spinner = function(dom, minValue, maxValue, increment, runtimeMode) {

  // Private Properties / Constructor
  var me = this;
  var up = document.createElement("div");
  var down = document.createElement("div");
  
  if (minValue != null && minValue != "") {
    minValue = Number(minValue);
    if (isNaN(minValue)) minValue = null;
  }
  else {
    minValue = null;
  }
  if (maxValue != null && maxValue != "") {
    maxValue = Number(maxValue);
    if (isNaN(maxValue)) maxValue = null;
  }
  else {
    maxValue = null;
  }
  if (increment != null) {
    increment = Number(increment);
    if (isNaN(increment)) increment = 1;
    if (increment == 0) increment = 1;
  }
  else {
    increment = 1;
  }

  up.className = "input";  // to pick up the default zIndex value
  up.onclick = function() {
    me.spin(increment);
  };
    
  down.className = "input";  // to pick up the default zIndex value
  down.onclick = function() {
    me.spin(-increment);
  };
  
  if (dom.pui==null || dom.pui.properties==null || dom.pui.properties["visibility"]==null || dom.pui.properties["visibility"]=="") {
    if ( context=="genie" && dom.fieldInfo!=null && dom.fieldInfo["attr"]!=null ) {
      var attr = dom.fieldInfo["attr"];
      if (attr == "27" || attr == "2F" || attr == "37" || attr == "3F") {
        me.hide();      
      }
    }
  }
  
  if (runtimeMode) {
    dom.style.paddingRight = "16px";
    dom.style.boxSizing = "border-box";
  }

  dom.extraDomEls = [up, down];

  if (dom.parentNode != null) {
    dom.parentNode.appendChild(up);
    dom.parentNode.appendChild(down);
  }

  // Public Properties
  
  // Public Methods
  this.positionSpinnButtons = function() {
    var left;
    left = dom.style.left;
    if (left != null && typeof left == "string" && left.length >= 3 && left.substr(left.length - 2, 2) == "px") left = parseInt(left);
    else left = dom.offsetLeft;
    if (isNaN(left)) left = 0;
    var top;
    top = dom.style.top;
    if (top != null && typeof top == "string" && top.length >= 3 && top.substr(top.length - 2, 2) == "px") top = parseInt(top);
    else top = dom.offsetTop;
    if (isNaN(top)) top = 0;
    up.style.left = left +  dom.offsetWidth - 15 + "px";
    top += parseInt((dom.offsetHeight - 18) / 2);
    if (pui["is_quirksmode"]) top -= 1;
    up.style.top = top + "px";
    up.style.zIndex = dom.style.zIndex;
    up.style.visibility = dom.style.visibility;

    left = dom.style.left;
    if (left != null && typeof left == "string" && left.length >= 3 && left.substr(left.length - 2, 2) == "px") left = parseInt(left);
    else left = dom.offsetLeft;
    if (isNaN(left)) left = 0;
    top = dom.style.top;
    if (top != null && typeof top == "string" && top.length >= 3 && top.substr(top.length - 2, 2) == "px") top = parseInt(top);
    else top = dom.offsetTop;
    if (isNaN(top)) top = 0;
    down.style.left = left + dom.offsetWidth - 15 + "px";
    top += 9;
    top += parseInt((dom.offsetHeight - 18) / 2);
    if (dom.offsetHeight % 2 == 1) {
      if (dom.offsetHeight < 18) top -= 1;
      else top += 1;
    }
    down.style.top = top + "px";
    down.style.zIndex = dom.style.zIndex;
    down.style.visibility = dom.style.visibility;
  };
  
  me.positionSpinnButtons();  // run this in the constructor
  
  this.hide = function() {
    up.style.visibility = "hidden";
    down.style.visibility = "hidden";
  };
  
  this.show = function() {
    up.style.visibility = "";
    down.style.visibility = "";
  };

  this.spin = function(byValue) {
    if (dom.disabled) return;
    if (dom.readOnly) return;
    var num = Number(dom.value);
    if (isNaN(num)) num = 0;
    num += byValue;
    num = Math.round(num * 10000) / 10000;
    if (minValue != null && num < minValue) num = minValue;
    if (maxValue != null && num > maxValue) num = maxValue;
    var maxLen = Number(dom.getAttribute("maxLength"));
    if (maxLen != null && !isNaN(maxLen) && maxLen > 0) {
      if (maxLen == 1 && num < 0) num = 0;
      if (String(num).length > maxLen) return;
    }

    var onspin = dom["onspin"];
    if (onspin != null) {
      var newValue = onspin(dom.value, byValue, dom, num);
      if (typeof newValue == "string" || typeof newValue == "number"){
        num = newValue;
      }
    }

    dom.value = num;
    dom.modified = true;
    pui.updateReactState(dom);
    if (context == "genie" && dom.fieldInfo != null && dom.fieldInfo["idx"] != null) {
      pui.response[dom.fieldInfo["idx"]] = dom;
    }

    pui.checkEmptyText(dom);    
  };

  this.setArrowClassNames = function(className) {
    if (className == null){
      up.className = "input pui-spinner-up-arrow-input";
     down.className = "input pui-spinner-down-arrow-input";
    }
    else{
      up.className = "input pui-spinner-up-arrow-input spinner-up-arrow-" + className;
      down.className = "input pui-spinner-down-arrow-input spinner-down-arrow-" + className;
    }
  };
  
  /**
   * Add a "disabled" attribute to spinner buttons when input is disabled. Note: the "disabled" PUI property specifies an "attribute" 
   * property, causing applyPropertyToField to set disabled via setAttribute. So, the dom.disabled is already set by this point.
   */
  this.setDisabled = function(){
    if (dom.disabled){
      up.setAttribute('disabled', 'true');
      down.setAttribute('disabled', 'true');
    }
    else {
      up.removeAttribute('disabled');
      down.removeAttribute('disabled');
    }
  };
};



pui.widgets.add({
  name: "spinner",
  tag: "input",
  //DesignItem uses pickIcon1 & 2 to positions the icons for the spinner and datefield
  pickIcon1: pui.normalizeURL("/profoundui/proddata/images/up.gif"),
  pickIcon2: pui.normalizeURL("/profoundui/proddata/images/down.gif"),
  icon1Class: 'input pui-spinner-up-arrow-input',
  icon2Class: 'input pui-spinner-down-arrow-input',
  pickIcon1IsDiv: true,
  pickIcon2IsDiv: true,
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        setTimeout( function() { 
          parms.dom.spinner = new pui.Spinner(parms.dom, parms.evalProperty("min value"), parms.evalProperty("max value"), parms.evalProperty("increment value"), !parms.design);
          parms.dom.sizeMe = function() {
            parms.dom.spinner.positionSpinnButtons();
          };
        }, 1);
        // Default off if not set by 'html auto complete' property.
        if (parms.dom.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
          parms.dom.setAttribute("autocomplete", "off");
          if (context == "dspf")
            parms.dom.setAttribute("name", pui.randomTextBoxName());
        }
      }
      else {
        parms.dom.sizeMe = function() {
          var itm = parms.designItem;
          itm.drawIcon();
          itm.mirrorDown();
        };
      }
      if (parms.design) parms.dom.readOnly = true;
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    },
    
    "disabled": function(parms){
      if (!parms.design){
        // I don't know why the constructor is in a timeout, but we must work around that (or rework the widget). MD.
        if (parms.dom.spinner){
          parms.dom.spinner.setDisabled();
        }
        else {
          setTimeout( function(){
            parms.dom.spinner.setDisabled();
          }, 1);
        }
      }
      // Note: designItem.setIcon is what renders the icons in Designer for some reason.
    },
    
    "visibility": function(parms) {
      
      // Oddly, 'spinner' is attached on a time delay, see above. Better make sure it's there -- DR.
      if (!parms.design && parms.dom.spinner) {
      
        if (parms.value == "hidden") {
        
          parms.dom.spinner.hide();
        
        }
        else {
        
          parms.dom.spinner.show();  
        
        }
      
      }
      
    },
    "css class": function(parms) {
      var className = parms.value.split(' ').shift();
      if (!parms.design) {
        if (parms.dom.spinner) parms.dom.spinner.setArrowClassNames(className);
        else setTimeout(function(){
          parms.dom.spinner.setArrowClassNames(className);
        }, 1);
      } else {
        var up = parms.designItem.icon1;
        var down = parms.designItem.icon2;
        if (className == null){
          var upClass = "input pui-spinner-up-arrow-input " + className;
          var downClass = "input pui-spinner-down-arrow-input " + className;
        }
        else{
          var upClass = "input pui-spinner-up-arrow-input spinner-up-arrow-" + className;
          var downClass = "input pui-spinner-down-arrow-input spinner-down-arrow-" + className;
        }
        parms.dom["icon1 class"] = upClass;
        parms.dom["icon2 class"] = downClass;
        up.className = upClass;
        down.className = downClass; 
      }
    },
    
    "browser auto complete": function(parms) {
      if (!parms.design) {
        parms.dom.setAttribute("autocomplete", parms.value);
        if (context == "dspf") {
          if (parms.value == "off")
            parms.dom.setAttribute("name", pui.randomTextBoxName());
          else
            parms.dom.removeAttribute("name");
        }
      }
    }

  }
  
});


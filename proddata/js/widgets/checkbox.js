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

// Prevent the user from checking or unchecking "read only" boxes, because that would change the value. #4925.
pui.checkboxOnClick = function(evt) {
  var target = evt.target;

  if (!target.readOnly) {
    var hasIndet = target["indeterminateValue"] !== undefined;

    // target.checked toggles back and forth between checked to not checked...
    // We want the checkbox value to toggle through 3 stages (When needed)
    // 1- Checked
    // 2- UnChecked
    // 3- Indeterminate (If applicable)

    if (target["checked"] === true) {
      if (target["unchecked"] !== true || !hasIndet) {
        target["unchecked"] = false;
        target["indeterminate"] = false;
      } else {
        target["checked"] = false;
        target["unchecked"] = false;
        target["indeterminate"] = true;
      }
    } else {
      target["indeterminate"] = false;
      target["unchecked"] = true;
    }
  }
};

pui.widgets.add({
  name: "checkbox",
  tag: "input",
  inputType: "checkbox",
  labelProperty: "label",
  resizable: false,
  defaults: {
    label: "Checkbox"
  },

  propertySetters: {

    "field type": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = (parms.evalProperty("checked value") !== "" ? parms.evalProperty("checked value") : "1");
      var indeterminateValue = (parms.evalProperty("indeterminate value") !== "" ? parms.evalProperty("indeterminate value") : "2");
      parms.dom.checkedValue = checkedValue;
      parms.dom["indeterminateValue"] = indeterminateValue;

      if (!pui["is_quirksmode"]) {
        if (!pui["is_old_ie"]) {
          parms.dom.style.margin = "2px";
        }
      }

      if (context == "genie" && parms.dom.originallyChecked != null && parms.properties["value"] == null && parms.properties["checked value"] == null) {
        parms.dom["checked"] = parms.dom.originallyChecked;
      }
      else {
        if (indeterminateValue && rtrim(objValue) === rtrim(indeterminateValue)) {
          parms.dom["indeterminate"] = true;
        }
        else {
          parms.dom["indeterminate"] = false;
          if (objValue == checkedValue) parms.dom["checked"] = true;
          else parms.dom["checked"] = false;
        }
      }
      parms.dom["unchecked"] = !parms.dom["checked"] && !parms.dom["indeterminate"];

      if (!parms.design) {
        var uncheckedValue = parms.evalProperty("unchecked value");
        parms.dom.uncheckedValue = uncheckedValue;
        if ((checkedValue === "" || checkedValue === null || checkedValue === undefined) &&
            (uncheckedValue === "" || uncheckedValue === null || uncheckedValue === undefined) &&
            (objValue === "1" || objValue === "true" || objValue === true)) parms.dom["checked"] = true;
        checkboxObjects.push(parms.dom);
        var labelText = parms.evalProperty("label");
        if (labelText != "") pui.buildLabel(parms.dom, labelText);
        // For "read only" checkboxes, don't allow the user to check or uncheck the box, because that would change the value. #4925.
        addEvent(parms.dom, "click", pui.checkboxOnClick);
        // Double-clicking in IE10, IE11, or pre-Chromium Edge should not change the clicked state. #2865.
        if (pui["is_ie"] || navigator.userAgent.indexOf("Edge/") != -1) {
          addEvent(parms.dom, "dblclick", pui.checkboxOnClick);
        }
      }
      // Fixes printing problem for IE8.
      // -- DR.
      pui.fixCheckPrint(parms.dom);
    },

    "value": function(parms) {
      var checkedValue = parms.evalProperty("checked value");
      var indeterminateValue = parms.evalProperty("indeterminate value");
      parms.dom.checkedValue = checkedValue;
      parms.dom.indeterminateValue = indeterminateValue;
      if (indeterminateValue && rtrim(parms.value) === rtrim(indeterminateValue)) {
        parms.dom["indeterminate"] = true;
      }
      else {
        parms.dom["indeterminate"] = false;
        if (parms.value == checkedValue) parms.dom["checked"] = true;
        else parms.dom["checked"] = false;
      }
      parms.dom["unchecked"] = !parms.dom["checked"] && !parms.dom["indeterminate"];

      if (!parms.design) {
        var uncheckedValue = parms.evalProperty("unchecked value");
        if ((checkedValue === "" || checkedValue === null || checkedValue === undefined) &&
            (uncheckedValue === "" || uncheckedValue === null || uncheckedValue === undefined) &&
            (parms.value === "1" || parms.value === "true" || parms.value === true)) parms.dom["checked"] = true;
      }

      // Fixes printing problem for IE8.
      // -- DR.
      pui.fixCheckPrint(parms.dom);
    },

    "checked value": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = parms.value;
      var indeterminateValue = parms.evalProperty("indeterminate value");
      parms.dom.checkedValue = checkedValue;
      parms.dom.indeterminateValue = indeterminateValue;
      if (indeterminateValue && rtrim(objValue) === rtrim(indeterminateValue)) {
        parms.dom["indeterminate"] = true;
      }
      else {
        parms.dom["indeterminate"] = false;
        if (objValue == checkedValue) parms.dom["checked"] = true;
        else parms.dom["checked"] = false;
      }
      parms.dom["unchecked"] = !parms.dom["checked"] && !parms.dom["indeterminate"];
      // Fixes printing problem for IE8.
      // -- DR.
      pui.fixCheckPrint(parms.dom);
    },

    "indeterminate value": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = (parms.evalProperty("checked value") !== "" ? parms.evalProperty("checked value") : "1");
      var indeterminateValue = parms.value;
      parms.dom.checkedValue = checkedValue;
      parms.dom.indeterminateValue = indeterminateValue;
      if (indeterminateValue && rtrim(objValue) === rtrim(indeterminateValue)) {
        parms.dom["indeterminate"] = true;
      }
      else {
        parms.dom["indeterminate"] = false;
        if (objValue == checkedValue) parms.dom["checked"] = true;
        else parms.dom["checked"] = false;
      }
      parms.dom["unchecked"] = !parms.dom["checked"] && !parms.dom["indeterminate"];
      // Fixes printing problem for IE8.
      // -- DR.
      pui.fixCheckPrint(parms.dom);
    },

    "visibility": function(parms) {
      // Note: when a widget is inside an old tab layout, then the parms.design flag of "visibility" property setters falsely indicates
      // "false" in Designer when tabs are drawn or switched. Do not assume an element property exists when parms.design is false. #7606.

      if (!parms.design && parms.dom.labelObj) {
        if (parms.value == "hidden") {
          parms.dom.labelObj.style.visibility = "hidden";
        }
        else {
          parms.dom.labelObj.style.visibility = "";
        }
      }
    },
    "css class": function(parms) {
      if (parms.design && parms.designItem.label) {
        parms.designItem.label.className = "label-for";
        var cls = trim(parms.value.split(" ")[0]);
        if (cls != "") {
          pui.addCssClass(parms.designItem.label, "label-for-" + cls);
        }
      }
    }
  }

});

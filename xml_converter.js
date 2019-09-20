exports.treeData = function getTheTree(xmlString) {

	//XML parser
	var DomParser = require('dom-parser');
	var parser = new DomParser();

	var dom = parser.parseFromString(xmlString);
	
	var sesvarsnodes = dom.getElementsByTagName('sesvars')[0];
	var sesvars = "";
	for (var i=0; i<sesvarsnodes.childNodes.length; i++) {
		if (sesvarsnodes.childNodes[i].nodeName == "sesvar") {
			var attrib = sesvarsnodes.childNodes[i].attributes;
			if (sesvars != "") {
				sesvars = sesvars + "<br />";
			}
			sesvars = sesvars + "<b>" + attrib[1].value + " = " + attrib[2].value + "</b>, comment: " + attrib[0].value;
		}
	}

	var semconsnodes = dom.getElementsByTagName('semcons')[0];
	var semcons = "";
	for (var i=0; i<sesvarsnodes.childNodes.length; i++) {
		if (semconsnodes.childNodes[i].nodeName == "semcon") {
			var attrib = semconsnodes.childNodes[i].attributes;
			if (semcons != "") {
				semcons = semcons + "<br />";
			}
			semcons = semcons + "<b>" + attrib[1].value + "</b>, result: " + attrib[0].value;
		}
	}

	var dom = dom.getElementsByTagName('node')[0];
	//console.log(dom)
	
	var nodeSpecificAttributes = [];
	
	//if the XML string is available, execute the function treebuildRecursive(...), otherwise load a pseudo tree -> root node is inserted here
	if (dom != undefined){
		//get attributes of first node
		infotext = getInfotextEntity(dom.childNodes);
		//insert the first node
		var jtree = {"name": dom.getAttribute("name"), "type": dom.getAttribute("type"), "info": infotext, "children": treebuildRecursive(dom)};
	} else {
		var jtree={"name": "no_tree", "type": "entity", "info": "Load tree!"}
	}
	
	//-----Helper functions for the function walking the tree-----

	function getInfotextEntity(childnodes) {
		var infotext = "";
		for (var j=0; j<childnodes.length; j++) {
			if (childnodes[j].nodeName == "attr") {
				infotext = getAttributeInfotext(childnodes[j], infotext);
			}
		}
		var returntext = infotext.replace(/&quot;/g, '\"');
		if (returntext != "") {
			nodeSpecificAttributes.push([childnodes[0].parentNode.attributes[1].value, returntext]);	//[name, atttributes]
		}
		return returntext;
	}

	function getInfotextAspect(childnodes) {
		var infotext = "";
		for (var j=0; j<childnodes.length; j++) {
			if (childnodes[j].nodeName == "aspr") {
				infotext = getAspectruleInfotext(childnodes[j], infotext)
			} else if (childnodes[j].nodeName == "prio") {
				infotext = getPriorityInfotext(childnodes[j], infotext);
			} else if (childnodes[j].nodeName == "cplg") {
				infotext = getCouplingInfotext(childnodes[j], infotext);
			}
		}
		var returntext = infotext.replace(/&quot;/g, '\"');
		if (returntext != "") {
			nodeSpecificAttributes.push([childnodes[0].parentNode.attributes[1].value, returntext]);	//[name, atttributes]
		}
		return returntext;
	}

	function getInfotextSpecialization(childnodes) {
		var infotext = "";
		for (var j=0; j<childnodes.length; j++) {
			if (childnodes[j].nodeName == "specr") {
				infotext = getSpecializationruleInfotext(childnodes[j], infotext);
			}
		}
		var returntext = infotext.replace(/&quot;/g, '\"');
		if (returntext != "") {
			nodeSpecificAttributes.push([childnodes[0].parentNode.attributes[1].value, returntext]);	//[name, atttributes]
		}
		return returntext;
	}

	function getInfotextMultiAspect(childnodes) {
		var infotext = "";
		for (var j=0; j<childnodes.length; j++) {
			if (childnodes[j].nodeName == "aspr") {
				infotext = getAspectruleInfotext(childnodes[j], infotext)
			} else if (childnodes[j].nodeName == "prio") {
				infotext = getPriorityInfotext(childnodes[j], infotext);
			} else if (childnodes[j].nodeName == "cplg") {
				infotext = getCouplingInfotext(childnodes[j], infotext);
			} else if (childnodes[j].nodeName == "numr") {
				infotext = getNumrepInfotext(childnodes[j], infotext);
			}
		}
		var returntext = infotext.replace(/&quot;/g, '\"');
		if (returntext != "") {
			nodeSpecificAttributes.push([childnodes[0].parentNode.attributes[1].value, returntext]);	//[name, atttributes]
		}
		return returntext;
	}

	function getAttributeInfotext(childnode, infotext) {
		var name = childnode.attributes[1].value;
		var value = childnode.attributes[2].value;
		var varfun = childnode.attributes[3].value;
		var comment = childnode.attributes[0].value;
		infotext = infotext + "attribute <b>" + name + ": " + value + "</b> - comment: " + comment + "<br />";
		return infotext;
	}

	function getAspectruleInfotext(childnode, infotext) {
		var condition = childnode.attributes[1].value;
		var result = childnode.attributes[2].value;
		var comment = childnode.attributes[0].value;
		infotext = infotext + "aspectrule <b>condition: " + condition + " - result: " + result + "</b> - comment: " + comment + "<br />";
		return infotext;
	}

	function getSpecializationruleInfotext(childnode, infotext) {
		var fornode = childnode.attributes[2].value;
		var condition = childnode.attributes[1].value;
		var result = childnode.attributes[3].value;
		var comment = childnode.attributes[0].value;
		infotext = infotext + "specrule <b>for node: " + fornode + " - condition: " + condition + " - result: " + result + "</b> - comment: " + comment + "<br />";
		return infotext;
	}

	function getCouplingInfotext(childnode, infotext) {
		var sourcenode = childnode.attributes[5].value;
		var sourceport = childnode.attributes[6].value;
		var sourcetype = childnode.attributes[7].value;
		var sinknode = childnode.attributes[2].value;
		var sinkport = childnode.attributes[3].value;
		var sinktype = childnode.attributes[4].value;
		var cplgfcn = childnode.attributes[1].value;
		var comment = childnode.attributes[0].value;
		if (cplgfcn == "") {
			infotext = infotext + "coupling: <b>" + sourcenode + " " + sourceport + "/" + sourcetype + " -> " + sinknode + " " + sinkport + "/" + sinktype + "</b> - comment: " + comment + "<br />";
		} else {
			infotext = infotext + "coupling <b>function: " + cplgfcn + "</b><br />";
		}		
		return infotext;
	}

	function getPriorityInfotext(childnode, infotext) {
		var value = childnode.attributes[0].value; 
		infotext = infotext + "priority <b>value: " + value + "</b><br />";
		return infotext;
	}

	function getNumrepInfotext(childnode, infotext) {
		var value = childnode.attributes[0].value;
		infotext = infotext + "numRep <b>value: " + value + "</b><br />";
		return infotext;
	}

	//-----This is the function for walikng the tree-----

	function treebuildRecursive(node) {
		var counter = 0;
		var children = Array(0);
		//if (node.getElementsByTagName('node')[0] != undefined) {
			for (var i = 0; i < node.childNodes.length; i++) {		
				if (node.childNodes[i].nodeName == "node"){
					
					var nodetype = node.childNodes[i].getAttribute("type");
					var childnodes = node.childNodes[i].childNodes;
					//var childrennodetags = node.childNodes[i].childNodes.map(function(o) {return o.nodeName});

					if (nodetype == "entity") {
						
						/*					
						if (childrennodetags.includes("attr")) {
							children[counter]={"name": node.childNodes[i].getAttribute("name"),
											"type": node.childNodes[i].getAttribute("type"),
											"info": node.childNodes[i].getElementsByTagName("attr")[0].getAttribute("name") + ": " + node.childNodes[i].getElementsByTagName("attr")[0].getAttribute("value").replace(/&quot;/g, '\ '),
											"children": treebuildRecursive(node.childNodes[i])};
						} else {
							children[counter]={"name": node.childNodes[i].getAttribute("name"),
											"type": node.childNodes[i].getAttribute("type"),
											"info": "",
											"children": treebuildRecursive(node.childNodes[i])};
						}
						*/
						
						//get the node specific attributes -> write in infotext
						var infotext = getInfotextEntity(childnodes);						
						//now append the node
						children[counter]={"name": node.childNodes[i].getAttribute("name"),
						                "type": node.childNodes[i].getAttribute("type"),
						                "info": infotext,
						                "children": treebuildRecursive(node.childNodes[i])};

					} else if (nodetype == "aspect") {
						//get the node specific attributes -> write in infotext
						var infotext = getInfotextAspect(childnodes);
						//now append the node
						children[counter]={"name": node.childNodes[i].getAttribute("name"),
						                "type": node.childNodes[i].getAttribute("type"),
						                "info": infotext,
						                "children": treebuildRecursive(node.childNodes[i])};

					} else if (nodetype == "specialization") {
						//get the node specific attributes -> write in infotext
						var infotext = getInfotextSpecialization(childnodes);
						//now append the node
						children[counter]={"name": node.childNodes[i].getAttribute("name"),
						                "type": node.childNodes[i].getAttribute("type"),
						                "info": infotext,
						                "children": treebuildRecursive(node.childNodes[i])};

					} else if (nodetype == "multiaspect") {
						//get the node specific attributes -> write in infotext
						var infotext = getInfotextMultiAspect(childnodes);
						//now append the node
						children[counter]={"name": node.childNodes[i].getAttribute("name"),
						                "type": node.childNodes[i].getAttribute("type"),
						                "info": infotext,
						                "children": treebuildRecursive(node.childNodes[i])};

					} else if (nodetype == "descriptive") {
						//descriptive nodes do not have any attributes
						//now append the node
						children[counter]={"name": node.childNodes[i].getAttribute("name"),
										"type": node.childNodes[i].getAttribute("type"),
										"info": "",
										"children": treebuildRecursive(node.childNodes[i])};

					}
					counter = counter + 1;
				}
			}
		//}
		return children;
	}
	return [jtree, sesvars, semcons, nodeSpecificAttributes];
}
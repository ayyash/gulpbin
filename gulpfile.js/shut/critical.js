
exports.CriticalText = function(txt, iscritical) {
  // find /* CRITICAL BEGIN */ and /* CRITICAL END */ and save their index location

  var re = /\/\* CRITICAL BEGIN \*\/[\s\S]*?\/\* CRITICAL END \*\//gim;
  var s;
  var matches = [];
  while (s = re.exec(txt)) {
    var rtl = s[0];
    matches.push(rtl);

  }
  // remove from css
  txt = txt.replace(re, '');

  if (!iscritical) {
    return txt;
  }

  // then create another text with the critical content
  let critical = '';
  for (var i = 0; i < matches.length; i++) {
    critical += matches[i] + '\n';
  }

  return critical;
}


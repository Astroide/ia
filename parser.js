var parser = {
  parse: txt => {
    if(!txt.startsWith('LDT\n')) throw new Error('Erreur: le fichier doit commencer par LDT, puis un saut de ligne.');
    txt = txt.replace('LDT\n', '');
    var matches = parser.searchRegexp.exec(txt);
    //console.log(matches);
    var title = matches[1] || ' ';
    var subtitle = matches[2] || ' ';
    var kvals = txt.split('\n:');
    var all = {};
    for(var kval of kvals){
      var kv2 = kval.split('\n');
      var k1 = kv2[0];
      k1 = parseInt(k1);
      var k2 = kv2.slice(1).join('\n');
      k2 = k2.replace(/[^\\]\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/[^\\]\*([^*]+)\*/g, '<em>$1</em>').replace(/\\\*/g, '*');
      all[k1] = k2;
      
    }
    return {
      entries: all,
      title: title,
      subtitle: subtitle
    };
  },
  searchRegexp: /([^\n]*)\n([^\n]*)/
};
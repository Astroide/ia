var parser = {
  parse: txt => {
    if(!txt.startsWith('LDT\n')) throw new Error('Erreur: le fichier doit commencer par LDT, puis un saut de ligne.');
    txt = txt.replace('LDT\n', '');
    var matches = parser.searchRegexp.exec(txt);
    //console.log(matches);
    var title = matches[1] || ' ';
    var subtitle = matches[2] || ' ';
    var kvals = txt.split('\n:');
    var all = {}, n=0;
    for(var kval of kvals){
      var kv2 = kval.split('\n');
      var k1 = kv2[0];
      k1 = parseInt(k1);
      var k2 = kv2.slice(1).join('\n');
      k2 = k2.replace(/[^\\]\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/[^\\]%([^\(]+)\(([^\)]*)\)/g, '&nbsp;<cat class="inline" title="$2">$1</cat>').replace(/[^\\]\[([^\|]+)\|([^\]]*)\]/g, '<a href="$2" title="$2">$1</a>').replace(/\/\*(.*)\*\//g, '<!-- /\\* \\*/ $1 -->')/*.replace(/\/\/(.*)\n/g, '<!-- // $1 -->')*/.replace(/[^\\]\*([^*]+)\*/g, '<em>$1</em>').replace(/\\\*/g, '*');
      all[k1] = k2;
      console.log(k2);
      n++;
    }
    for(var prop in all){
      all[prop] = all[prop].replace(/{&&}/g, n);
    }
    return {
      entries: all,
      title: title,
      subtitle: subtitle
    };
  },
  searchRegexp: /([^\n]*)\n([^\n]*)/
};
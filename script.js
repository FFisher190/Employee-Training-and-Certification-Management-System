
  // demo data
  var students = [
    { id:1, name:"Maya", dept:"CSE", tasks:8, email:"maya@college.edu", modules:[
      { name:"Python Basics", due: offset(60) },
      { name:"HTML & CSS", due: offset(120) }
    ]},
    { id:2, name:"Arjun", dept:"IT", tasks:5, email:"arjun@college.edu", modules:[
      { name:"Java Programming", due: offset(30) }
    ]},
    { id:3, name:"Sara", dept:"ECE", tasks:12, email:"sara@college.edu", modules:[
      { name:"Mini Project Submission", due: offset(10) },
      { name:"Cloud Workshop", due: offset(5) }
    ]},
    { id:4, name:"Niraj", dept:"CSE", tasks:3, email:"liam@college.edu", modules:[
      { name:"Database Basics", due: offset(90) }
    ]},
    { id:5, name:"Yashodha", dept:"AI", tasks:6, email:"chen@college.edu", modules:[
      { name:"ML Intro", due: offset(20) }
    ]}
  ];

  // helper
  function offset(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0,10);
  }
  function daysLeft(datestr) {
    return Math.ceil((new Date(datestr) - new Date()) / (1000*60*60*24));
  }

  // simple state
  var query = "";
  var dept = "All";
  var daysWindow = 30;

  // elements
  var qEl = document.getElementById('q');
  var deptEl = document.getElementById('deptFilter');
  var barsEl = document.getElementById('bars');
  var tblEl = document.getElementById('studentTable');
  var cntStudentsEl = document.getElementById('cntStudents');
  var cntModulesEl = document.getElementById('cntModules');
  var avgTasksEl = document.getElementById('avgTasks');
  var rangeEl = document.getElementById('rangeDays');
  var daysLabel = document.getElementById('days');
  var expiringEl = document.getElementById('expiringList');

  // fill dept dropdown
  function setupDept() {
    var ds = ["All"];
    for (var i=0;i<students.length;i++){
      if (ds.indexOf(students[i].dept) === -1) ds.push(students[i].dept);
    }
    deptEl.innerHTML = "";
    for (var j=0;j<ds.length;j++){
      var opt = document.createElement('option');
      opt.value = ds[j];
      opt.textContent = ds[j];
      deptEl.appendChild(opt);
    }
  }

  // render summary
  function renderSummary(){
    cntStudentsEl.textContent = students.length;
    var mods = 0;
    var t = 0;
    for (var i=0;i<students.length;i++){
      mods += students[i].modules.length;
      t += students[i].tasks;
    }
    cntModulesEl.textContent = mods;
    avgTasksEl.textContent = (t / students.length).toFixed(1);
  }

  // render bars 
  function renderBars(){
    var html = "<div style='font-size:13px;color:#555;margin-bottom:8px;'>Students (tasks completed)</div>";
    // find max for scale
    var max = 1;
    for (var i=0;i<students.length;i++){
      if (students[i].tasks > max) max = students[i].tasks;
    }
    for (var i=0;i<students.length;i++){
      var s = students[i];
      // small bar width percent
      var pct = Math.round((s.tasks / max) * 80); // max 80% width
      html += "<div class='bar-row'>";
      html += "<div class='bar-name'>" + s.name + "</div>";
      html += "<div class='bar-track'><div class='bar-fill' style='width:" + pct + "%'>" + s.tasks + "</div></div>";
      html += "</div>";
    }
    barsEl.innerHTML = html;
  }

  // render table
  function renderTable(){
    var q = (query || "").toLowerCase();
    var rows = "";
    for (var i=0;i<students.length;i++){
      var s = students[i];
      if (dept !== "All" && s.dept !== dept) continue;
      if (q && (s.name.toLowerCase().indexOf(q) === -1 && s.dept.toLowerCase().indexOf(q) === -1)) continue;
      // pick next module due
      var next = null;
      for (var m=0;m<s.modules.length;m++){
        var mod = s.modules[m];
        if (!next || new Date(mod.due) < new Date(next.due)) next = mod;
      }
      var nextTxt = next ? next.name + " • " + next.due + " (" + daysLeft(next.due) + "d)" : "—";
      rows += "<tr><td>" + s.name + "</td><td>" + s.dept + "</td><td>" + s.tasks + "</td><td>" + s.modules.length + "</td><td>" + nextTxt + "</td></tr>";
    }
    tblEl.innerHTML = rows;
  }

  // render expiring
  function renderExpiring(){
    daysLabel.textContent = daysWindow;
    var list = "";
    for (var i=0;i<students.length;i++){
      var s = students[i];
      for (var j=0;j<s.modules.length;j++){
        var mod = s.modules[j];
        var dl = daysLeft(mod.due);
        if (dl <= daysWindow) {
          list += "<div>" + s.name + " - " + mod.name + " due " + mod.due + " (" + dl + "d)</div>";
        }
      }
    }
    if (!list) list = "<div style='color:#666'>No modules due in the selected window.</div>";
    expiringEl.innerHTML = list;
  }

  // Export Excel (Changes to be made later)
  function exportExcel(){
    var rows = [];
    rows.push(["Name","Dept","Tasks","Modules"].join(","));
    for (var i=0;i<students.length;i++){
      var s = students[i];
      rows.push([s.name, s.dept, s.tasks, s.modules.length].join(","));
    }
    var csv = rows.join("\n");
    var blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "students.xls";
    a.click();
  }

  // event wiring 
  qEl = document.getElementById('q');
  qEl.oninput = function(){ query = qEl.value; renderTable(); };
  deptEl.onchange = function(){ dept = deptEl.value; renderTable(); };
  rangeEl.oninput = function(){ daysWindow = parseInt(rangeEl.value); renderExpiring(); };
  document.getElementById('exportBtn').onclick = function(){ exportExcel(); };

  // init
  setupDept();
  renderSummary();
  renderBars();
  renderTable();
  renderExpiring();


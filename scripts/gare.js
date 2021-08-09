﻿const database = firebase.database().ref();
var uid = undefined;

var gare_id = null;
var id = null;
var openmethod = true;
var autoopenpanel = false;

function setUid(val) {
    uid = val;
}

function loadParams() {
    database.child("users").child(uid).get().then((snapshot) => {
        openmethod = snapshot.val().openmethod;
        autoopenpanel = snapshot.val().autoopenpanel;
        if (!openmethod) {
            if (autoopenpanel) {
                document.getElementById('showdeparts').setAttribute('onclick', 'window.open("departs.htm'+window.location.search+'&panel");');
                document.getElementById('showarrives').setAttribute('onclick', 'window.open("arrives.htm'+window.location.search+'");');
            } else {
                document.getElementById('showdeparts').setAttribute('onclick', 'window.open("departs.htm'+window.location.search+'");');
                document.getElementById('showarrives').setAttribute('onclick', 'window.open("arrives.htm'+window.location.search+'");');
            }
        } else {
            if (autoopenpanel) {
                document.getElementById('showdeparts').setAttribute('onclick', 'window.open("departs.htm'+document.location.search+'&panel", "", "height=500,width=750");');
            }
        }
    });
}

function createGareLink(gid) {
    var glink = "https://infogares.page.link/?link=https://infogare.fr/gare.htm?uid="+uid+"%26id="+gid;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyCWi0EChm97lofJrhqBp6wRRtgQGKq8IEg", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        longDynamicLink: glink
    }));
    var data = JSON.parse(xhr.responseText);
    var link = data['shortLink'];
    console.log(link);
    database.child('users').child(uid).child('gares').child(gid).update({
        link: link
    }).then(() => {
        document.getElementById('share_link').value = link;
        loadQR(link);
    })
}

function loadGares(userid) {
    uid = userid;
    database.child("users").child(userid).child("gares").get().then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childsnapshot) => {
                var name = childsnapshot.val().name;
                var id = childsnapshot.val().id;
                var trains = childsnapshot.child('trains').numChildren();
                var type = childsnapshot.val().type;
                var link = childsnapshot.val().link;
                var listgroupitem = document.createElement('li');
                var managmentitemcontent = document.createElement('div');
                var managmentitemsymbol = document.createElement('div');
                var icon = document.createElement('i');
                var managmentitemmain = document.createElement('div');
                var title = document.createElement('h2');
                var metalist = document.createElement('ul');
                var id_div = document.createElement('li');
                var trains_div = document.createElement('li');
                var type_div = document.createElement('li');
                var managmentitemaction = document.createElement('div');
                var btn_del = document.createElement('button');
                var btn_del_i = document.createElement('i');
                var btn_del_span = document.createElement('span');
                var btn_modify = document.createElement('button');
                var btn_modify_i = document.createElement('i');
                var btn_modify_span = document.createElement('span');
                var btn_public = document.createElement('button');
                var btn_public_i = document.createElement('i');
                var btn_public_span = document.createElement('span');
                
                title.appendChild(document.createTextNode(name));
                id_div.appendChild(document.createTextNode('ID : '+id));
                trains_div.appendChild(document.createTextNode(trains+' trains'));
                if (type === 'neutral') {
                    type_div.appendChild(document.createTextNode('Gare normale'));
                } else {
                    type_div.appendChild(document.createTextNode('Gare RER'));
                }
                
                id_div.setAttribute('class', 'meta-list-item');
                trains_div.setAttribute('class', 'meta-list-item separator');
                type_div.setAttribute('class', 'meta-list-item separator separator');
                
                metalist.setAttribute('class', 'meta-list font-weight-medium');
                metalist.appendChild(id_div);
                metalist.appendChild(trains_div);
                metalist.appendChild(type_div);
                
                managmentitemmain.setAttribute('class', 'management-item-main');
                managmentitemmain.setAttribute('style', 'cursor: pointer;');
                if (type === 'neutral') {
                    managmentitemmain.setAttribute('onclick', 'window.location.href="gare.htm?id='+id+'"');
                } else {
                    managmentitemmain.setAttribute('onclick', 'window.location.href="gare_rer.htm?id='+id+'"');
                }
                managmentitemmain.appendChild(title);
                managmentitemmain.appendChild(metalist);
                
                icon.setAttribute('class', 'icons-itinerary-train-station icons-size-1x25');
                icon.setAttribute('aria-hidden', 'true');
                
                managmentitemsymbol.setAttribute('class', 'management-item-symbol');
                managmentitemsymbol.appendChild(icon);
                
                btn_del_i.setAttribute('class', 'icons-circle-delete');
                btn_del_i.setAttribute('aria-hidden', 'true');
                
                btn_del_span.setAttribute('class', 'sr-only');
                btn_del_span.appendChild(document.createTextNode('Supprimer'));
                
                btn_del.setAttribute('class', 'btn btn-options dropdown-toggle');
                btn_del.setAttribute('data-toggle', 'modal');
                btn_del.setAttribute('data-target', '#del');
                btn_del.setAttribute('onclick', 'setGare('+id+'); document.getElementById("del_gare_name").appendChild(document.createTextNode("'+name+'"));');
                btn_del.setAttribute('title', 'Supprimer la gare');
                btn_del.appendChild(btn_del_i);
                btn_del.appendChild(btn_del_span);
                
                btn_modify_i.setAttribute('class', 'icons-pencil');
                btn_modify_i.setAttribute('aria-hidden', 'true');
                
                btn_modify_span.setAttribute('class', 'sr-only');
                btn_modify_span.appendChild(document.createTextNode('Modifier'));
                
                btn_modify.setAttribute('class', 'btn btn-options dropdown-toggle');
                btn_modify.setAttribute('data-toggle', 'modal')
                btn_modify.setAttribute('data-target', '#modif_gare');
                btn_modify.setAttribute('onclick', 'prepModifGare('+id+');');
                btn_modify.setAttribute('title', 'Modifier la gare');
                btn_modify.appendChild(btn_modify_i);
                btn_modify.appendChild(btn_modify_span);

                btn_public_i.setAttribute('class', 'icons-share');
                btn_public_i.setAttribute('aria-hidden', 'true');

                btn_public_span.setAttribute('class', 'sr-only');
                btn_public_span.appendChild(document.createTextNode('Partager'));

                btn_public.setAttribute('class', 'btn btn-options dropdown-toggle');
                btn_public.setAttribute('data-toggle', 'modal');
                btn_public.setAttribute('data-target', '#share');
                btn_public.setAttribute('onclick', 'prepSharing('+id+');');
                btn_public.setAttribute('title', 'Partager la gare');
                btn_public.appendChild(btn_public_i);
                btn_public.appendChild(btn_public_span);
                
                managmentitemaction.setAttribute('class', 'management-item-action');
                managmentitemaction.appendChild(btn_public);
                managmentitemaction.appendChild(btn_modify);
                managmentitemaction.appendChild(btn_del);
                
                managmentitemcontent.setAttribute('class', 'management-item-content');
                managmentitemcontent.appendChild(managmentitemsymbol);
                managmentitemcontent.appendChild(managmentitemmain);
                managmentitemcontent.appendChild(managmentitemaction);
                
                listgroupitem.setAttribute('class', 'list-group-item management-item');
                listgroupitem.appendChild(managmentitemcontent);
                
                document.getElementById('gares').appendChild(listgroupitem);
            });
            document.getElementById('gares').hidden = false;
            document.getElementById('loader').style.display = 'none';
        }else{
            document.getElementById('gares_div').appendChild(document.createTextNode('Aucune gare pour le moment ;)'));
            document.getElementById('loader').style.display = 'none';
        }
    }).catch((error) => {
        document.getElementById('error_loading').hidden = false;
        document.getElementById('loader').style.display = 'none';
    })
}

function prepModifGare(gid) {
    database.child("users").child(uid).child("gares").child(gid).get().then((snapshot) => {
        document.getElementById('modif_gare_name').value = snapshot.val().name;
        document.getElementById('modify_gare_btn').setAttribute('onclick', 'modifyGare('+snapshot.val().id+');');
        document.getElementById('modif_gare_infos').value = snapshot.val().infos;
        document.getElementById('modify_gare_edit_time_1').value = snapshot.val().timebeforeshow;
        document.getElementById('modify_gare_edit_time_2').value = snapshot.val().timeafterhide;
    }).catch((error) => {
        setError('Préparation de la modification de la gare', error.stack);
        document.getElementById('error_loading').hidden = false;
    })
}

function prepSharing(gid) {
    database.child("users").child(uid).child("gares").child(gid).get().then((snapshot) => {
        document.getElementById('share_public').checked = snapshot.val().public;
        if (snapshot.val().link === undefined) {
            createGareLink(snapshot.val().id);
        } else {
            loadQR(snapshot.val().link);
            document.getElementById('share_link').value = snapshot.val().link;
        }
        document.getElementById('share_validate').setAttribute('onclick', 'modifSharing('+snapshot.val().id+');');
    });
}

function modifSharing(gid) {
    database.child("users").child(uid).child("gares").child(gid).update({
        public: document.getElementById('share_public').checked
    });
}

function prepModifTrain(tid) {
    database.child("users").child(uid).child("gares").child(gare_id).child("trains").child(tid).get().then((snapshot) => {
        document.getElementById('train_number').value = snapshot.val().number;
        document.getElementById('train_dest').value = snapshot.val().destination;
        document.getElementById('train_prov').value = snapshot.val().provenance;
        document.getElementById('train_type').value = snapshot.val().type;
        document.getElementById('train_hour_depart').value = snapshot.val().hourdepart;
        document.getElementById('train_hour_arrive').value = snapshot.val().hourarrive;
        document.getElementById('train_retard_time').value = snapshot.val().retardtime;
        document.getElementById('train_dynamic').value = snapshot.val().alternance;
        document.getElementById('train_hall').value = snapshot.val().hall;
        if (snapshot.val().retardtype === 'alheure') {
            document.getElementById('train_alheure').checked = true;
        } else if (snapshot.val().retardtype === 'retindet') {
            document.getElementById('train_retindet').checked = true;
        } else if (snapshot.val().retardtype === 'ret') {
            document.getElementById('train_ret').checked = true;
        } else {
            document.getElementById('train_suppr').checked = true;
        }
        document.getElementById('train_voie').value = snapshot.val().voie;
        var gares = snapshot.val().gares;
        var from = snapshot.val().from;
        
        document.getElementById('from_modify').value = from;
        document.getElementById('gares_modify').value = gares;

        document.getElementById('from_modify_div').hidden = false;
        document.getElementById('gares_modify_div').hidden = false;
        document.getElementById('chips').hidden = true;
        document.getElementById('chips2').hidden = true;
        
        document.getElementById('validate').setAttribute('onclick', 'modifTrain('+tid+');');
        document.getElementById('validate').innerText = 'Modifier';

        document.getElementById('loader').style.display = 'none';
    }).catch((error) => {
        setError('Préparation de la modification du train', error.stack);
        document.getElementById('error_loading').hidden = false;
        document.getElementById('loader').style.display = 'none';
    })
}

function modifTrain(tid) {
    var retardtype;
    
    if (document.getElementById('train_alheure').checked == true) {
        retardtype = 'alheure';
    } else if (document.getElementById('train_retindet').checked == true) {
        retardtype = 'retindet';
    } else if (document.getElementById('train_ret').checked == true) {
        retardtype = 'ret';
    } else {
        retardtype = 'suppr';
    }
    
    database.child("users").child(uid).child("gares").child(gare_id).child("trains").child(tid).update({
        number: document.getElementById('train_number').value,
        destination: document.getElementById('train_dest').value,
        provenance: document.getElementById('train_prov').value,
        hourdepart: document.getElementById('train_hour_depart').value.replace(':', 'h'),
        hourarrive: document.getElementById('train_hour_arrive').value.replace(':', 'h'),
        type: document.getElementById('train_type').value,
        retardtime: document.getElementById('train_retard_time').value,
        retardtype: retardtype,
        voie: document.getElementById('train_voie').value,
        gares: document.getElementById('gares_modify').value,
        from: document.getElementById('from_modify').value,
        alternance: document.getElementById('train_dynamic').value,
        hall: document.getElementById('train_hall').value
    }).then((snapshot) => {
        window.close();
    }).catch((error) => {
        setError('Application des modifications au train', error.stack);
        document.getElementById('error_loading').hidden = false;
    });
}

function modifyGare(gid) {
    var hm;
    if (document.getElementById('gare_rer_edit_hour_1').checked) {
        hm = 'showhour';
    } else {
        hm = 'showremaining';
    }

    database.child("users").child(uid).child("gares").child(gid).update({
        name: document.getElementById('modif_gare_name').value,
        infos: document.getElementById('modif_gare_infos').value,
        alapproche: document.getElementById('modif_alapproche').value,
        aquai: document.getElementById('modif_aquai').value,
        hourmode: hm,
        timebeforeshow: document.getElementById('modify_gare_edit_time_1').value,
        timeafterhide: document.getElementById('modify_gare_edit_time_2').value
    }).then((snapshot) => {
        document.location.reload();
    }).catch((error) => {
        setError('Application des modifications à la gare', error.stack);
    })
}

function setGare(gid) {
    id = gid;
    gare_id = gid;
}

function getGare() {
    return id;
}

function delGare(gid) {
    database.child("users").child(uid).child("gares").child(gid).remove().then(() => {
        document.location.reload();
    });
}

function delTrain(tid) {
    database.child("users").child(uid).child("gares").child(gare_id).child("trains").child(tid).remove().then(() => {
        document.location.reload();
    });
}

function createGare(name) {
    var id = Math.round(Math.random() * 1000000000)
    var gare_type = document.getElementById('gare_type').value;
    var hm;
    if (document.getElementById('gare_rer_edit_hour_1').checked) {
        hm = 'showhour';
    } else {
        hm = 'showremaining';
    }
    database.child("users").child(uid).child("gares").child(id).set({
        id: id,
        name: name,
        infos: document.getElementById('gare_infos').value,
        type: gare_type,
        alapproche: document.getElementById('alapproche').value,
        aquai: document.getElementById('aquai').value,
        hourmode: hm,
        timebeforeshow: document.getElementById('gare_edit_time_1').value,
        timeafterhide: document.getElementById('gare_edit_time_2').value
    }).then((snapshot) => {
        document.location.reload();
    });
}

function loadGare(userid){
    var params = new URLSearchParams(window.location.search);
    gare_id = params.get("id");
    database.child("users").child(userid).child("gares").child(params.get("id")).get().then((snapshot) => {
        if (snapshot.exists()) {
            document.title = 'InfoGare - '+snapshot.val().name;
            database.child("users").child(userid).child("gares").child(params.get("id")).child("trains").get().then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childsnapshot) => {
                        var dest = childsnapshot.val().destination;
                        var prov = childsnapshot.val().provenance;
                        var id = childsnapshot.val().id;
                        var hourdepart = childsnapshot.val().hourdepart;
                        var hourarrive = childsnapshot.val().hourarrive;
                        var traintype = childsnapshot.val().type;
                        var listgroupitem = document.createElement('li');
                        var managmentitemcontent = document.createElement('div');
                        var managmentitemsymbol = document.createElement('div');
                        var icon = document.createElement('i');
                        var managmentitemmain = document.createElement('div');
                        var managmentitemaction = document.createElement('div');
                        var btnmodify = document.createElement('button');
                        var btnmodifyicon = document.createElement('i');
                        var spanmodify = document.createElement('span');
                        var title = document.createElement('h2');
                        var metalist = document.createElement('ul');
                        var traintypeli = document.createElement('li');
                        var hourli = document.createElement('li');
                        var provli = document.createElement('li');
                        var btndel = document.createElement('button');
                        var btndelicon = document.createElement('i');
                        var spandel = document.createElement('span');
                        var btndupli = document.createElement('button');
                        var btndupliicon = document.createElement('i');
                        var spandupli = document.createElement('span');
                        
                        title.appendChild(document.createTextNode(dest));
                        provli.appendChild(document.createTextNode('Provenance : ' + prov));
                        traintypeli.appendChild(document.createTextNode(traintype));
                        hourli.appendChild(document.createTextNode(hourarrive + ' > ' + hourdepart));
                        
                        provli.setAttribute('class', 'meta-list-item');
                        
                        hourli.setAttribute('class', 'meta-list-item separator');
                                                
                        traintypeli.setAttribute('class', 'meta-list-item separator');
                        
                        metalist.setAttribute('class', 'meta-list font-weight-medium');
                        metalist.appendChild(provli);
                        metalist.appendChild(hourli);
                        metalist.appendChild(traintypeli);
                        
                        managmentitemmain.setAttribute('class', 'management-item-main');
                        if (openmethod) {
                            if (userid == uid) {
                                managmentitemmain.setAttribute('onclick', 'window.open("train.htm?gid='+gare_id+'&tid='+id+'", "", "height=500,width=750");');
                            } else {
                                managmentitemmain.setAttribute('onclick', 'window.open("train.htm?uid='+userid+'&gid='+gare_id+'&tid='+id+'", "", "height=500,width=750");');
                            }
                        } else {
                            if (userid == uid) {
                                managmentitemmain.setAttribute('onclick', 'window.open("train.htm?gid='+gare_id+'&tid='+id+'");');
                            } else {
                                managmentitemmain.setAttribute('onclick', 'window.open("train.htm?uid='+userid+'&gid='+gare_id+'&tid='+id+'");');
                            }
                        }
                        managmentitemmain.setAttribute('style', 'cursor: pointer;');
                        managmentitemmain.appendChild(title);
                        managmentitemmain.appendChild(metalist);
                        
                        icon.setAttribute('class', 'icons-itinerary-train icons-size-1x25');
                        icon.setAttribute('aria-hidden', 'true');
                        
                        managmentitemsymbol.setAttribute('class', 'management-item-symbol');
                        managmentitemsymbol.appendChild(icon);
                        
                        btnmodify.setAttribute('class', 'btn btn-options dropdown-toggle');
                        btnmodify.setAttribute('type', 'button');
                        btnmodify.setAttribute('title', 'Modifier le train');
                        btnmodify.setAttribute('onclick', 'window.open("modif_train.htm?gid='+gare_id+'&tid='+id+'&action=modify", "", "height=500,width=750");');
                        btnmodify.setAttribute('data-toggle', 'modal');
                        btnmodify.setAttribute('data-target', '#train');
                        
                        btnmodifyicon.setAttribute('class', 'icons-pencil');
                        btnmodifyicon.setAttribute('aria-hidden', 'true');
                        
                        spanmodify.setAttribute('class', 'sr-only');
                        spanmodify.appendChild(document.createTextNode('Modifier'));
                        
                        btnmodify.appendChild(btnmodifyicon);
                        btnmodify.appendChild(spanmodify);
                        
                        btndel.setAttribute('class', 'btn btn-options dropdown-toggle');
                        btndel.setAttribute('type', 'button');
                        btndel.setAttribute('title', 'Supprimer le train');
                        btndel.setAttribute('onclick', 'document.getElementById("btn_del").setAttribute("onclick", "delTrain(' + id + ');");');
                        btndel.setAttribute('data-toggle', 'modal');
                        btndel.setAttribute('data-target', '#del_train');
                        
                        btndelicon.setAttribute('class', 'icons-circle-delete');
                        btndelicon.setAttribute('aria-hidden', 'true');
                        
                        spandel.setAttribute('class', 'sr-only');
                        spandel.appendChild(document.createTextNode('Supprimer'));
                        
                        btndel.appendChild(btndelicon);
                        btndel.appendChild(spandel);

                        btndupli.setAttribute('class', 'btn btn-options dropdown-toggle');
                        btndupli.setAttribute('type', 'button');
                        btndupli.setAttribute('title', 'Dupliquer le train');
                        btndupli.setAttribute('onclick', 'prepDupliTrain('+id+');');
                        btndupli.setAttribute('data-toggle', 'modal');
                        btndupli.setAttribute('data-target', '#train');

                        btndupliicon.setAttribute('class', 'icons-distribution');
                        btndupliicon.setAttribute('aria-hidden', 'true');

                        spandupli.setAttribute('class', 'sr-only');
                        spandupli.appendChild(document.createTextNode('Dupliquer'));

                        btndupli.appendChild(btndupliicon);
                        btndupli.appendChild(spandupli);
                                          
                        managmentitemaction.setAttribute('class', 'managerment-item-action');
                        managmentitemaction.appendChild(btnmodify);
                        managmentitemaction.appendChild(btndupli);
                        managmentitemaction.appendChild(btndel);

                        managmentitemcontent.setAttribute('class', 'management-item-content');
                        managmentitemcontent.appendChild(managmentitemsymbol);
                        managmentitemcontent.appendChild(managmentitemmain);
                        if (userid == uid) {
                            managmentitemcontent.appendChild(managmentitemaction);
                        }
                        
                        listgroupitem.setAttribute('class', 'list-group-item management-item');
                        listgroupitem.appendChild(managmentitemcontent);
                        
                        document.getElementById('trains').appendChild(listgroupitem);
                    });
                    document.getElementById('trains').hidden = false;
                    document.getElementById('loader').style.display = 'none';
                } else {
                    document.getElementById('trains_div').appendChild(document.createTextNode('Il n\'y a pas de trains ;)'));
                    document.getElementById('loader').style.display = 'none';
                }
            });
        } else {
            //window.location.href = "gares.htm";
        }
    }).catch((error) => {
        setError('Chargement de la gare', error.stack);
        document.getElementById('error_loading').hidden = false;
        document.getElementById('loader').style.display = 'none';
    });
}

function prepDupliTrain(tid) {
    database.child('users').child(uid).child('gares').child(gare_id).child('trains').child(tid).get().then((snapshot) => {
        document.getElementById('train_number').value = snapshot.val().number;
        document.getElementById('train_prov').value = snapshot.val().provenance;
        document.getElementById('train_dest').value = snapshot.val().destination;
        document.getElementById('train_type').value = snapshot.val().type;
        document.getElementById('train_hour_arrive').value = snapshot.val().hourarrive.replace('h', ':');
        document.getElementById('train_hour_depart').value = snapshot.val().hourdepart.replace('h', ':');
        if (snapshot.val().retardtype === 'ret') {
            document.getElementById('train_ret').checked = true;
        } else if (snapshot.val().retardtype === 'alheure') {
            document.getElementById('train_alheure').checked = true;
        } else if (snapshot.val().retardtype === 'retindet') {
            document.getElementById('train_retindet').checked = true;
        } else if (snapshot.val().retardtype === 'suppr') {
            document.getElementById('train_suppr').checked == true;
        }
        document.getElementById('train_retard_time').value = snapshot.val().retardtime;
        document.getElementById('train_voie').value = snapshot.val().voie;
        document.getElementById('train_gares_prov').value = snapshot.val().from;
        document.getElementById('train_gares_dest').value = snapshot.val().gares;
        document.getElementById('train_alternance').value = snapshot.val().alternance;
        document.getElementById('train_hall').value = snapshot.val().hall;

        document.getElementById('validate').setAttribute('onclick', 'dupliTrain()');
        document.getElementById('validate').innerText = 'Dupliquer';

        document.getElementById('loader').style.display = 'none';
    }).catch((error) => {
        setError('Préparation de la duplication du train', error.stack);
        document.getElementById('error_loading').hidden = false;
    })
}

function dupliTrain() {
    var trainid = Math.round(Math.random() * 1000000000);

    var rtype = undefined;

    if (document.getElementById('train_alheure').checked) {
        rtype = 'alheure';
    } else if (document.getElementById('train_retindet').checked) {
        rtype = 'retindet';
    } else if(document.getElementById('train_ret').checked) {
        rtype = 'ret';
    } else if (document.getElementById('train_suppr').checked) {
        rtype = 'suppr';
    }

    database.child('users').child(uid).child('gares').child(gare_id).child('trains').child(trainid).set({
        id: trainid,
        number: document.getElementById('train_number').value,
        provenance: document.getElementById('train_prov').value,
        destination: document.getElementById('train_dest').value,
        type: document.getElementById('train_type').value,
        retardtype: rtype,
        retardtime: document.getElementById('train_retard_time').value,
        voie: document.getElementById('train_voie').value,
        from: document.getElementById('train_gares_prov').value,
        gares: document.getElementById('train_gares_dest').value,
        hourdepart: document.getElementById('train_hour_depart').value,
        hourarrive: document.getElementById('train_hour_arrive').value,
        alternance: document.getElementById('train_alternance').value,
        hall: document.getElementById('train_hall').value
    }).then(() => {
        window.location.reload();
    }).catch((error) => {
        setError('Duplication du train', error.stack);
        document.getElementById('error_loading').hidden = false;
    })
}

function createTrain() {
    var params = new URLSearchParams(window.location.search);
    gare_id = params.get("id");

    var trainid = Math.round(Math.random() * 1000000000);
    var e = document.getElementById('train_type');
    var rettype = undefined;
    if (document.getElementById('train_alheure').checked == true) {
        rettype = 'alheure';
    } else if (document.getElementById('train_retindet').checked == true) {
        rettype = 'retindet';
    } else if (document.getElementById('train_ret').checked == true) {
        rettype = 'ret';
    } else {
        rettype = 'suppr';
    }
    var gares = "";
    var from = "";
    
    var x = document.getElementById('gares');
    var y = document.getElementById('from');
    var i, j;
    
    for (i = 0; i < x.length; i++) {
        gares = gares + x.options[i].value + "|";
    }
    
    for (j = 0; j < y.length; j++) {
        from = from + y.options[j].value + "|";
    }
    
    database.child("users").child(uid).child("gares").child(gare_id).child("trains").child(trainid).set({
        id: trainid,
        destination: document.getElementById('train_dest').value,
        provenance: document.getElementById('train_prov').value,
        number: document.getElementById('train_number').value,
        type: e.options[e.selectedIndex].text,
        hourdepart: document.getElementById('train_hour_depart').value.replace(':', 'h'),
        hourarrive: document.getElementById('train_hour_arrive').value.replace(':', 'h'),
        retardtype: rettype,
        retardtime: document.getElementById('train_retard_time').value,
        from: from,
        gares: gares,
        voie: document.getElementById('train_voie').value,
        alternance: document.getElementById('train_dynamic').value,
        hall: document.getElementById('train_hall').value
    }).then((snapshot) => {
        document.location.reload();
    }).catch((error) => {
        setError('Création du train', error.stack);
        document.getElementById('error_loading').hidden = false;
    })
}

var active_train;

function loadTrainModification(id){
    active_train = id;
    
}

function checkGare(state) {
    document.getElementById('gare_rer_edit').hidden = state;
    document.getElementById('gare_edit').hidden =! state;
}
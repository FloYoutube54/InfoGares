﻿const database = firebase.database().ref();

var list = new Array();

function loadTrains(user_id, id){
    var group = document.createElement('div');
    group.setAttribute('id', 'group');
    var ref = firebase.database().ref("users/" + user_id + "/gares/" + id + "/trains");
    var infos = firebase.database().ref("users/"+user_id+"/gares/"+id);

    infos.on('child_changed', (snapshot) => {
        var txt = snapshot.val();
        document.getElementById('infos').innerHTML = txt.replaceAll('\n', ' &nbsp;');
    });

    ref.on('child_changed', (snapshot) => {
        location.href="departs.htm?id="+id;
    });

    ref.get().then((snapshot) => {
        snapshot.forEach((child) => {
            if (child.val().hourdepart != "") {
                var showed;
                if (child.val().show === undefined) {
                    showed = true;
                } else {
                    showed = child.val().show;
                }
                
                var voieshowed;

                if (child.val().showvoie === undefined) {
                    voieshowed = true;
                } else {
                    voieshowed = child.val().showvoie;
                }

                list.push({
                    number: child.val().number,
                    destination: child.val().destination,
                    hourdepart: child.val().hourdepart,
                    type: child.val().type,
                    gares: child.val().gares,
                    retardtime: child.val().retardtime,
                    retardtype: child.val().retardtype,
                    voie: child.val().voie,
                    show: showed,
                    showvoie: voieshowed
                });
            }
        });
        list.sort((a, b) => {
            var x = a.hourdepart.toLowerCase();
            var y = b.hourdepart.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
        var i = 0;
        list.forEach((value, index, array) => {
            if (i != 7) {
                if (value["show"]){
                    // Root
                    var firstrow = document.createElement('div');
                    var secondrow = document.createElement('div');
                    
                    // First Row
                    var firstcol_firstrow = document.createElement('div');
                    var secondfirstcol_firstrow = document.createElement('div');
                    var secondsecondcol_firstrow = document.createElement('div');
                    var secondthirdcol_firstrow = document.createElement('div');
                    var thirdcol_firstrow = document.createElement('div');
                    
                    // First Col
                    var logo = document.createElement('div');
                    
                    // Second First Col
                    var animationblink = document.createElement('div');
                    var animationblink1 = document.createElement('div');
                    var animationblink2 = document.createElement('div');
                    var type = document.createElement('span');
                    var br = document.createElement('br');
                    var number = document.createElement('span');
                    
                    // Second Third Col
                    var dest = document.createElement('span');
                    
                    // Third Col
                    var track = document.createElement('div');
                    var voie = document.createElement('span');
                    
                    // Second Row
                    var firstcol_secondrow = document.createElement('div');
                    var secondcol_secondrow = document.createElement('div');
                    var thirdcol_secondrow = document.createElement('div');
                    
                    // Second Col
                    var gares = document.createElement('div');
                    
                    // Values
                    const train_destination = value["destination"];
                    const train_hour = value["hourdepart"];
                    const train_number = value["number"];
                    const train_type = value["type"];
                    const train_gares = value["gares"];
                    const train_retard_type = value["retardtype"];
                    const train_retard_time = value["retardtime"];
                    const train_voie = value["voie"];
                    
                    var gares_split = train_gares.substr(0, train_gares.length - 1).split("|");
                    var retard, textfeature;
                    var animation_time = 5.30 * gares_split.length;
                    
                    if (train_retard_type === 'alheure') {
                        retard = 'à l\'heure';
                        textfeature = 1;
                    } else if (train_retard_type === 'retindet') {
                        retard = 'ret. indet.';
                        textfeature = 3;
                    } else if (train_retard_type === 'ret') {
                        retard = 'retard '+train_retard_time+' min.';
                        textfeature = 3;
                    } else {
                        retard = 'supprimé';
                        textfeature = 3;
                    }
                    
                    gares_split.forEach((item, index) => {
                        var span = document.createElement('span');
                        span.appendChild(document.createTextNode(item));
                        gares.appendChild(span);
                    });
                    
                    if (train_type === 'TER') {
                        logo.setAttribute('class', 'train-logo train-logo-ter');
                    } else if (train_type === 'TGV') {
                        logo.setAttribute('class', 'train-logo train-logo-tgv');
                    } else if (train_type === 'OuiGo') {
                        logo.setAttribute('class', 'train-logo train-logo-ouigo');
                    } else if (train_type === 'inOui') {
                        logo.setAttribute('class', 'train-logo train-logo-inoui');
                    } else if (train_type === 'Thalys') {
                        logo.setAttribute('class', 'train-logo train-logo-thalys');
                    } else if (train_type === 'Eurostar') {
                        logo.setAttribute('class', 'train-logo train-logo-eurostar');
                    } else if (train_type === 'TGV Lyria') {
                        logo.setAttribute('class', 'train-logo train-logo-lyria');
                    } else if (train_type === 'ICE') {
                        logo.setAttribute('class', 'train-logo train-logo-ice');
                    } else if (train_type === 'Fluo Grand Est') {
                        logo.setAttribute('class', 'train-logo train-logo-fluo');
                    } else if (train_type === 'TER Occitanie') {
                        logo.setAttribute('class', 'train-logo train-logo-occitanie');
                    } else if (train_type === 'Intercité') {
                        logo.setAttribute('class', 'train-logo train-logo-intercite');
                    } else {            
                        logo.setAttribute('class', 'train-logo train-logo-sncf');
                    }
                    
                    firstcol_firstrow.setAttribute('class', 'col-first');
                    firstcol_firstrow.appendChild(logo);
                    
                    animationblink.setAttribute('class', 'animation-blink');
                    animationblink1.setAttribute('class', 'animation-blink-1');
                    type.setAttribute('class', 'text-type');
                    type.appendChild(document.createTextNode(train_type));
                    number.setAttribute('class', 'text-number');
                    number.appendChild(document.createTextNode(train_number));
                    animationblink2.setAttribute('class', 'animation-blink-2 text-features-'+textfeature);
                    animationblink2.appendChild(document.createTextNode(retard));
                    animationblink1.appendChild(type);
                    animationblink1.appendChild(br);
                    animationblink1.appendChild(number);
                    animationblink.appendChild(animationblink1);
                    animationblink.appendChild(animationblink2);
                    
                    secondfirstcol_firstrow.appendChild(animationblink);
                    secondfirstcol_firstrow.setAttribute('class', 'col-second-first');
                    
                    if (train_retard_type === 'alheure') {
                        secondsecondcol_firstrow.appendChild(document.createTextNode(train_hour.replace(':', 'h')));
                        secondsecondcol_firstrow.setAttribute('class', 'col-second-second text-time');
                    } else {
                        secondsecondcol_firstrow.setAttribute('class', 'col-second-second text-time-retard animation-blink');
                        var hour = Math.floor(train_hour.substr(0, 2));
                        var minutes = Math.floor(train_hour.substr(3, 4));
                        var retard = Math.floor(train_retard_time);
                        var hourandret = Math.floor(minutes + retard);

                        if (hourandret > 59) {
                            var quotient = Math.floor(hourandret/60);
                            var rest = hourandret % 60;
                            hour += quotient;
                            hourandret = rest;
                        }

                        if (hourandret < 10) {
                            hourandret = '0' + hourandret;
                        }

                        var second_animationblink1 = document.createElement('div');
                        var second_animationblink2 = document.createElement('div');

                        second_animationblink2.setAttribute('class', 'text-time retard animation-blink-2');
                        second_animationblink2.appendChild(document.createTextNode(hour + "h" + hourandret));

                        second_animationblink1.setAttribute('class', 'text-time animation-blink-1');
                        second_animationblink1.appendChild(document.createTextNode(train_hour.replace(':', 'h')));

                        secondsecondcol_firstrow.appendChild(second_animationblink2);
                        secondsecondcol_firstrow.appendChild(second_animationblink1);
                    }
                    
                    dest.appendChild(document.createTextNode(train_destination));
                    dest.setAttribute('class', '');
                    
                    secondthirdcol_firstrow.appendChild(dest);
                    secondthirdcol_firstrow.setAttribute('class', 'col-second-third');
                    

                    if (train_type === 'Car TER') {
                        voie.setAttribute('class', 'train-track train-track-car');

                        track.appendChild(voie);
                        track.setAttribute('class', 'train-track train-track-car voie');
                    } else {
                        voie.appendChild(document.createTextNode(train_voie));
                        
                        track.appendChild(voie);
                        track.setAttribute('class', 'train-track train-track-view voie');
                    }
                    
                    if (value['showvoie']) {
                        thirdcol_firstrow.appendChild(track);
                    }
                    thirdcol_firstrow.setAttribute('class', 'col-third');
                    
                    firstrow.appendChild(firstcol_firstrow);
                    firstrow.appendChild(secondfirstcol_firstrow);
                    firstrow.appendChild(secondsecondcol_firstrow);
                    firstrow.appendChild(secondthirdcol_firstrow);
                    firstrow.appendChild(thirdcol_firstrow);
                    
                    if (i < 2) {
                        firstcol_secondrow.setAttribute('class', 'col-first');
                        
                        gares.setAttribute('class', 'train-stations text-scroll-x scroll-x animation-scroll-x');
                        gares.setAttribute('style', 'animation-duration: '+animation_time+'s; padding-left: 100%;');
                        secondcol_secondrow.appendChild(gares);
                        secondcol_secondrow.setAttribute('class', 'col-second');
                        
                        thirdcol_secondrow.setAttribute('class', 'col-third');
                        
                        secondrow.appendChild(firstcol_secondrow);
                        secondrow.appendChild(secondcol_secondrow);
                        secondrow.appendChild(thirdcol_secondrow);
                    }
                        
                    firstrow.setAttribute('class', 'row');
                    secondrow.setAttribute('class', 'row');
                    
                    var rowgroup = document.createElement('div');
                    if (i < 2){
                        rowgroup.setAttribute('class', 'row-group row-train row-group-2');
                    } else {
                        rowgroup.setAttribute('class', 'row-group row-train');
                    }
                    rowgroup.appendChild(firstrow);
                    if (i < 2) {
                        rowgroup.appendChild(secondrow);
                    }
                    
                    group.appendChild(rowgroup);
                    
                    i++;            
                }
            }
        });        
        document.getElementById('group').remove();
        document.getElementById('rows').appendChild(group);
        
        database.child("users").child(user_id).child("gares").child(id).get().then((snapshot) => {
            document.getElementById('infos').innerHTML = snapshot.val().infos.replace('\n', ' &nbsp;');

            document.getElementById('bg').hidden = false;
            //document.getElementById('loader').style.display = 'none';
            
            scrollX();
            checkHiddenTrains(user_id, id);
        });
    });
}

function checkHiddenTrains(uid, gid) {
    database.child('users').child(uid).child('gares').child(gid).child('trains').get().then((snapshot) => {
        snapshot.forEach((child) => {
            var now_date = new Date(Date.now());

            var nowhour = now_date.getHours();
            var nowmin = now_date.getMinutes();
            var trainhour = child.val().hourdepart.substr(0, 2);
            var trainmin = child.val().hourdepart.substr(3, 4);

            var trainminafter, trainhourafter;
                        
            console.log(nowhour + ' : ' + nowmin);
            console.log(trainhour + ' : ' + trainmin);

            if (Math.floor(trainmin + 2) > 59) {
                trainhourafter = trainhour + 1;
                trainminafter =trainmin + ((trainmin + 2) % 60);
            }

            var child_a = database.child('users').child(uid).child('gares').child(gid).child('trains').child(child.val().id);

            if (nowhour == trainhour && nowmin == trainmin - 20) {
                child_a.update({
                    show: true
                });
                console.log('shown');
            } else if (nowhour <= trainhour && nowmin < trainmin) {
                child_a.update({
                    show: false
                });
                console.log('hidden');
            }
        });
    });
}
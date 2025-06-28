function Var(s,o){
    if(s.includes('\'')){
        var l=s.match(/\'[A-z0-9]+/g)[0].slice(1);
        if(l.length==s.length-1){
            return o.address[o[l]]
        }else{
            //if(Number.isInteger(o.address[o[l]])){
                return o.address[eval(s.replaceAll('\''+l,String(o.address[o[l]])))]
            //}
        }
        return o.address[o[s.slice(1)]]
    }
    return Number(s)
}
function t(s,o){
    var w1=s.slice(0,s.indexOf('(')).toLowerCase()
    var w0=s.slice(s.indexOf('(')+1.,s.lastIndexOf(')'))
    var arr=[]

    var dep=0;
    var p='';
    var isVar=true;
    for(var i=0;i<w0.length;i++){
        if(w0[i]=='('){
            dep++;
            if(i>0&&w0[i-1].match(/[A-z0-9]/g)[0].length){
                isVar=false
            }else{isVar=true;}
            p+='(';
            continue;
        }
        if(w0[i]==')'){
            dep--;
            p+=')'
            if(dep==0){
                if(isVar){
                    arr.push(Var(p,o))
                }else{
                    arr.push(t(p,o))
                }
                p=''
            }
            continue;
        }
        
        if(w0[i]==','){
            if(dep==0){
                arr.push(Var(p,o));
                p='';
            }else{
                p+=','
            }
            continue;
        }
        p+=w0[i]
    }
    if(p.length){arr.push(Var(p,o))}
    return {type:w1,arr:arr}
}
const C=(arr)=>({r:arr[0]/255,g:arr[1]/255,b:arr[2]/255})
function reParse(o){
    var AtomPos=[];//[x,y,z,r,C]
    var Bonds=[];//[x0,y0,z0,x1,y1,z1,r,C] or [Point0,Point1,r,C]
    for(var j=0;j<o.address.length;j++){
        var i=o.address[j]
        if(i.type=='atom'||i.type=='a'){
            AtomPos.push([
                i.arr[0],
                i.arr[1],
                i.arr[2],
                i.arr[3],
                C(i.arr[4].arr)
            ])
        }else if(i.type=='bond'||i.type=='b'){
            if(i.arr.length==8){
                Bonds.push([
                    i.arr[0],
                    i.arr[1],
                    i.arr[2],
                    i.arr[3],
                    i.arr[4],
                    i.arr[5],
                    i.arr[6],
                    C(i.arr[7].arr)
                ])
            }else if(i.arr.length==4){
                Bonds.push([
                    i.arr[0].arr[0],
                    i.arr[0].arr[1],
                    i.arr[0].arr[2],
                    i.arr[1].arr[0],
                    i.arr[1].arr[1],
                    i.arr[1].arr[2],
                    i.arr[2],
                    C(i.arr[3].arr)
                ])
            }
        }
    }
    return {Atoms:AtomPos,Bonds:Bonds}
}

function Parse(code){
    var o={};
    o.address=[]
    var tp=code.split('\n').map(e=>e.trim()).filter(e=>e.length&&e[0]!='#')
    for(var i=0;i<tp.length;i++){
        var w=0;
        if(tp[i].includes('=')){
            var f=tp[i].split('=')
            if(f[1].match(/[A-z0-9]{1}\(/g)){
                o[f[0].slice(1)]=i
                w=t(f[1],o)
            }else{
                o[f[0].slice(1)]=i
                w=Var(f[1],o)
            }
            
        }else if(tp[i].includes(':')){
            o[tp[i].slice(0,-1)]=i;
            w=i
        }else{
            w=t(tp[i],o)
        }
        o.address.push(w)
    }
    return o
}

code=`
'Na0=Color(255,255,255)
'Cl0=Color(0,255,0)
'Bond=Color(200,200,200)
'r=0.5
Na:
    Atom(1,1,1,'r,'Na0)
    Atom(1,1,-1,'r,'Na0)
    Atom(1,-1,1,'r,'Na0)
    Atom(1,-1,-1,'r,'Na0)
    Atom(-1,1,1,'r,'Na0)
    Atom(-1,1,-1,'r,'Na0)
    Atom(-1,-1,1,'r,'Na0)
    Atom(-1,-1,-1,'r,'Na0)
    Atom(1,0,0,'r,'Na0)
    Atom(-1,0,0,'r,'Na0)
    Atom(0,1,0,'r,'Na0)
    Atom(0,-1,0,'r,'Na0)
    Atom(0,0,1,'r,'Na0)
    Atom(0,0,-1,'r,'Na0)
Cl:
    'W=Atom(0,0,0,'r,'Cl0)
    Atom(1,1,0,'r,'Cl0)
    Atom(-1,1,0,'r,'Cl0)
    Atom(-1,-1,0,'r,'Cl0)
    Atom(1,-1,0,'r,'Cl0)
    Atom(1,0,1,'r,'Cl0)
    Atom(-1,0,1,'r,'Cl0)
    Atom(-1,0,-1,'r,'Cl0)
    Atom(1,0,-1,'r,'Cl0)
    Atom(0,-1,1,'r,'Cl0)
    Atom(0,1,-1,'r,'Cl0)
    Atom(0,-1,-1,'r,'Cl0)
    Atom(0,1,1,'r,'Cl0)
ChemistryBond:
    Bond('Cl+1,'Cl+2,'r,'Bond)
`
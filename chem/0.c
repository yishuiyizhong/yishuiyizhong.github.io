#include <stdio.h>
#include <stdlib.h>
typedef unsigned int id;
typedef unsigned char bool;
typedef struct {
    unsigned int s1:2;
    unsigned int s2:2;
    unsigned int s3:2;
    unsigned int s4:2;
} BondsRoot;
typedef struct _E0{
    unsigned int type:4;
    id chain[4];
    bool mark;
    BondsRoot a;
} E;
E* SignESpace(unsigned int n){
    return (E*)malloc(n*sizeof(E));
}
const int EBondssTable[9]={
    3,4,3,2,1,2,1,1,1,0
};
unsigned int GetTypeForE(char e[]){
    if(e[0]=='B'){return 0;}
    else if(e[0]=='C'){return 1;}
    else if(e[0]=='N'){return 2;}
    else if(e[0]=='O'){return 3;}
    else if(e[0]=='F'){return 4;}
    else if(e[0]=='S'){return 5;}
    else if(e[0]=='C'&&e[1]=='l'){return 6;}
    else if(e[0]=='B'&&e[1]=='r'){return 7;}
    else if(e[0]=='I'){return 8;}
    //else throw an error
}
BondsRoot AnalyChain(id chain[4]){
    BondsRoot w;
    for(int i=0;i<4;i++){
        bool mark = 1;
        for(int j=0;j<i;j++){
            if(chain[j]==chain[i]){
                mark=0;
            }
        }
        if(mark){
            unsigned int count=0;
            for(int j=i;j<4;j++){
                if(chain[j]==chain[i]){
                    count++;
                }
            }
            (*(int*)((char*)(&w)+(2*count-2)))++;
        }
    }
    return w;
}
void RmRepeat(int** l/*[][4]*/,int** p,size_t n){
    for(size_t j=0;j<n;j++){
        for (size_t i=0;i<4;i++) {
            l[j][i]=0;
        }
    }
    unsigned int o=0;
    for(int i=0;i<n;i++){
        o=0;
        for(int j=1;j<5;j++){
            if(p[i][j]==0){continue;}
            bool mark=1;
            for(int k=1;k<j;k++){
                if(l[i][j-1]==p[i][k]){mark=0;}
            }
            if(mark){
                l[i][o]=p[i][j];
                o++;
            }
        }
    }
}
int Test_GenerateETree(){
    unsigned int P[9][5]={//1,3,5-TriCH3Ben
        {1,7,6,2,2},{1,1,1,3,0},{1,2,8,4,4},
        {1,3,3,5,0},{1,4,9,6,6},{1,5,5,1,0},
        {1,1,0,0,0},{1,3,0,0,0},{1,5,0,0,0}
    };//{Type,BondsIDs(0->H)}
    unsigned int G[9][4];
    RmRepeat(G,P,9);
    E* r=SignESpace(9);
    for(int i=0;i<9;i++){
        r[i].type=P[i][0];
        r[i].chain[0]=P[i][1];
        r[i].chain[1]=P[i][2];
        r[i].chain[2]=P[i][3];
        r[i].chain[3]=P[i][4];
        r[i].mark=0;
    }
    return r;
}
typedef struct _Road{
    unsigned int Etype:3;
    BondsRoot* b;
    Road* n;
    Road* l;
    bool isHead;
} Road;
Road* GetRoad(){
    Road* s=(Road*)malloc(sizeof(Road));
    s->Etype=0;
    s->b=NULL;
    s->n=NULL;
    s->l=NULL;
    s->isHead=0;
    return s;
}
Road* GetRoadHead(Road* mid){
    Road* u=mid;
    while(u->l!=NULL){
        u=u->l;
    }
    return u;
}
typedef struct _CloneChain{
    Road* k;
    unsigned int length;
    CloneChain* n;
}CloneChain;
CloneChain* GetCC(){
    CloneChain* s=(CloneChain*)malloc(sizeof(CloneChain));
    s->k=NULL;
    s->length=0;
    s->n=NULL;
    return s;
}
Road* CloneRoad(Road* last,CloneChain* cc){
    Road* u=last;
    unsigned int y=1;
    while(u->l!=NULL){
        u=u->l;
        y++;
    }
    CloneChain* t=GetCC();
    t->length=y;
    Road* s=(Road*)malloc(y*sizeof(Road));
    s[0].Etype=0;
    s[0].b=u->b;
    s[0].n=u->n;
    s[0].l=u->l;
    s[0].isHead=0;
    y=0;
    while(u->n!=NULL){
        y++;
        s[y].Etype=u->n->Etype;
        s[y].b=u->n->b;
        s[y].n=u->n->n;
        s[y].l=u->n->l;
        s[y].isHead=0;
        u=u->n;
    }
    t->k=s;
    if(cc->length==0){
        cc->k=t->k;
        cc->length=t->length;
        cc->n=NULL;
    }else{cc->n=t;}
}
bool nextRoad(E* tree,int** g,size_t n,id from/*,id to*/,Road* last,CloneChain* cc){
    Road* d;
    if(last->b==NULL){
        last->b=&tree[from].a;
        last->Etype=tree[from].type;
        d=last;
    }else{
        d=GetRoad();
        d->l=last;
        d->Etype=tree[from].type;
        d->b=&tree[from].a;
        last->n=d;
    }
    unsigned int c=0;
    for(int i=0;i<4;i++){
        if(tree[g[from][i]].mark||g[from][i]==0){continue;c++;}
        tree[g[from][i]].mark=1;
        nextRoad(tree,g,n,g[from][i],/*to*/d,cc);
    }
    if(c==4){
        CloneRoad(d,cc);
    }
}
void RoadSearch(E* tree,int** g,size_t n,id from,id to){
    Road f;
    f.isHead=1;
    id last=from;
    CloneChain c;
    nextRoad(tree,g,n,from,/*to*/&f,&c);

}
int main(){
    return 0;
}
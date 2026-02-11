---
title: Zerojudge 
cover: /images/ZJ.webp
date: 2025-07-11 12:00:00
tags:
  - Zerojudge
category: program
urlname: Zerojudge
---
just....Zerojudge
<!-- more -->
## Easy
### a001.哈囉
https://zerojudge.tw/ShowProblem?problemid=a001
```CPP
#include <iostream>
using namespace std;

int main() {
string s;
 while(cin >> s){
  cout << "hello, "<< s << "\n";
 }
 return 0;
}
```
### a002. 簡易加法
https://zerojudge.tw/ShowProblem?problemid=a002
```CPP
#include<iostream>
using namespace std;
int main()
{
    int a,b;
    cin>>a>>b;
    cout<< a+b;
    return 0;
}
```
### a003. 兩光法師占卜術
https://zerojudge.tw/ShowProblem?problemid=a003
```CPP
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    int result = (a * 2 + b) % 3;

    if (result == 0) {
        cout << "普通";
    } else if (result == 1) {
        cout << "吉";
    } else if (result == 2) {
        cout << "大吉";
    }

    return 0;
}
```
### a004. 文文的求婚
https://zerojudge.tw/ShowProblem?problemid=a004
```CPP
#include <iostream>
using namespace std;

int main() {
  int a;
	while(cin>>a){
    bool isleapa= (a % 4 == 0 && a % 100 != 0) || (a % 400 == 0);
    if(isleapa){
      cout<<"閏年\n";
     }
    else{
     cout<<"平年\n";
     }
    }
    return 0;
}
```
### a005. Eva 的回家作業
https://zerojudge.tw/ShowProblem?problemid=a005
```CPP
#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t; 

    for (int i = 0; i < t; i++) {
        int a, b, c, d; 
        
        cin >> a >> b >> c >> d;
        if (b - a == c - b && c - b == d - c) {
        
            int e = d + (d - c);
            cout << a << " " << b << " " << c << " " << d << " " << e <<'\n';
        }
        else if (b / a == c / b && c / b == d / c) {
        
            int e = d * (d / c);
            cout << a << " " << b << " " << c << " " << d << " " << e <<'\n';
        }
    }

    return 0;
}
```
### a006. 一元二次方程式
https://zerojudge.tw/ShowProblem?problemid=a006
```CPP
#include<iostream>
#include<cmath>
using namespace std;

int main()
{
    int a,b,c;
    cin>>a>>b>>c;
    int d = b*b-4*a*c;
    
    if (d<0) {
    cout<<"No real root"<<'\n';
    }
    
    else if(d==0){
    double x1= -b/(2.0*a);
    cout<<"Two same roots x="<<x1<<'\n';
    }
    else{ 
    double x1= (-b+sqrt(d))/(2*a);
    double x2= (-b-sqrt(d))/(2*a);
          
    cout <<"Two different roots "<<"x1="<<x1<<" , x2="<<x2<<'\n';
    }
    return 0;
}
```
### a040. 阿姆斯壯數
https://zerojudge.tw/ShowProblem?problemid=a040
```CPP
#include<bits/stdc++.h>
using namespace std;

bool have =0;
void sp(int i){
    string s = to_string(i);
    int sum=0;
    for(int j=0;j<s.size();j++){
        int spn=0;
        int d = s[j] - '0';
        spn = pow(d,s.size());
        sum+=spn;
    }
    if(sum==i){
        have =1;
        cout << i << " ";
    }
}

int main(){
    int s,e;
    cin >> s >> e;
    for(int i = s;i <= e;++i){
        sp(i);
    }
    if(have == 0){
        cout << "none";
    }
}
```
### a024. 最大公因數(GCD)
https://zerojudge.tw/ShowProblem?problemid=a024

偷懶大法(use __gcd())
```CPP
#include<bits/stdc++.h>
using namespace std;

int main(){
    int a,b,c;
    cin >> a >> b;
    c = __gcd(a,b);
    cout << c ;
}
```
### a065. 提款卡密碼
https://zerojudge.tw/ShowProblem?problemid=a065
```CPP
#include<bits/stdc++.h>
using namespace std;

int main(){
    string a;
    cin >> a;
    for(int i=1;i<a.size();i++){
        int far = abs(a[i]-a[i-1]);
        cout << far ;
    }
}
```
### c315. I, ROBOT 前傳
https://zerojudge.tw/ShowProblem?problemid=c315
```CPP
#include<bits/stdc++.h>
using namespace std;

int main(){
    int n,a,b;
    int x=0,y=0;
    cin >> n;
    for(int i=0;i<n;i++){
        cin >> a >> b;
        if(a==0){
            y+=b;
        }
        if(a==1){
            x+=b;
        }
        if(a==2){
            y-=b;
        }
        if(a==3){
            x-=b;
        }
    }
    cout << x <<" "<< y;
}

```
## TOI
### n630. 電影院 (Cinema)
```CPP
#include <bits/stdc++.h>
using namespace std;

struct movtime {
    int h;
    int m;
    int tm() const {
        return h * 60 + m;
    }
    void print() const {
    cout << setw(2) << setfill('0') << h << " "
            << setw(2) << setfill('0') << m << "\n";
    }
};

int main() {
    int n;
    cin >> n;
    vector<movtime> times(n);
    for (int i = 0; i < n; i++) {
        cin >> times[i].h >> times[i].m;
    }

    movtime now;
    cin >> now.h >> now.m;
    int ntm = now.tm() + 20;

    bool found = false;
    for (const movtime& movie : times) {
        if (movie.tm() >= ntm) {
            movie.print();
            found = true;
            break;
        }
    }

    if (!found) {
        cout << "Too Late" << endl;
    }

    return 0;
}
```
### n631. 撲克 (Poker)
這題我一整個讀錯題義
我用觀察排序後的關係，去估算可湊出幾副牌和缺了多少張；這題應該是要用「每個牌號出現幾次」來精準對應牌組數量與缺少數。直接套用組合的數學關係即可。
```CPP 錯誤寫法
#include<bits/stdc++.h>
using namespace std;

int main(){
    int n,cnt=52,r=0;
    cin >> n;
    vector<int>poker(n);
    for(int i=0;i<n;i++){
        cin >> poker[i];
    }
    int d = n/52;
    for (int i = 1; i < poker.size(); i++) {
        if (poker[i] ==poker[i - 1]+1) cnt--;
    }
    sort(poker.begin(), poker.end());
    for (int i = 1; i < poker.size(); i++) {
        if (poker[i] == poker[i - 1]){
                r++;
                cnt+=52-r;
        }
    }
    cout << d << " " << cnt << "\n";
}
```
```CPP 正解
#include <bits/stdc++.h>
using namespace std;

int main(){
    int n;
    cin >> n;
    vector<int> cnt(53, 0);
    for(int i = 0; i < n; ++i){
        int k;
        cin >> k;
        cnt[k]++;
    }
    int last = *min_element(cnt.begin() + 1, cnt.end());
    int most = *max_element(cnt.begin() + 1, cnt.end());
    int tn = most * 52;
    int add = tn - n;

    cout << last << " " << add << "\n";
}
```
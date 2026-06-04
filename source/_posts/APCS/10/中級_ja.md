---
title: APCS 2025年10月 中級解説
date: 2026-06-04
categories:
  - 技術分享
cover: /images/save.webp
tags:
  - APCS
urlname: APCS202510
lang: ja
---
## 問題1：彗星衝突 [（問題説明）](https://zerojudge.tw/ShowProblem?problemid=r488)
* ポイント：2次元配列シミュレーション (領域値変更 & 境界判定)
* 解説
    * 主要なポイントは (a, b) を中心とした半径 s の範囲に恐竜がいるかどうかを検出することです。いない場合は、各ポイントから d を減らします
    * 各ポイント上に何頭の恐竜がいるかを記録する配列を作成します
    * 影響範囲を走査するとき、左界は b - s/2、上界は a - s/2 となることが分かります。したがって左上隅 (a - s/2, b - s/2) から s × s 行列を走査できます（境界判定を忘れずに）
    * 恐竜がいる場合（dino[i][j] > 0）、まず起きている恐竜の数から dino[i][j] を引き、dino[i][j] の値を 0 に変更します。そうでない場合はすべてから d を減らします

```CPP
#include<bits/stdc++.h>
using namespace std;

int main(){
    int R=0,C=0,D=0,K=0,M=0;
    cin >> R >> C >> D;
    vector<vector<int>>mp (R,vector<int>(C,D));
    vector<vector<int>>aw (R,vector<int>(C));
    cin >> K;
    for(int i=0;i<K;i++){
        int a=0,b=0;
        cin >> a >> b;
        aw[a][b]++;
    }
    cin >> M;
    for(int i=0;i<M;i++){
        int a=0,b=0,s=0,d=0;
        cin >> a >> b >> s >> d;
        int r1 = max(0, a - s/2);
        int r2 = min(R-1, a + s/2);
        int c1 = max(0, b - s/2);
        int c2 = min(C-1, b + s/2);
        bool hasDino = false;
        for(int x=r1;x<=r2;x++){
            for(int y=c1;y<=c2;y++){
                if(aw[x][y] != 0) hasDino = true;
            }
        }
        if(hasDino){
            for(int x = r1; x <= r2; x++)
                for(int y = c1; y <= c2; y++)
                    aw[x][y] = 0;
        }else{
            for(int x = r1; x <= r2; x++)
                for(int y = c1; y <= c2; y++)
                    mp[x][y] -= d;
        }
    }
    
    int maxVal = mp[0][0];
    int minVal = mp[0][0];

    for(int i = 0; i < R; i++){
        for(int j = 0; j < C; j++){
            maxVal = max(maxVal, mp[i][j]);
            minVal = min(minVal, mp[i][j]);
        }
    }
    
    int total = 0;
    for(int i = 0; i < R; i++){
        for(int j = 0; j < C; j++){
            total += aw[i][j];
        }
    }
    cout << maxVal << " " << minVal << " " << total;
}
```

## 問題2：航空写真画像 [（問題説明）](https://zerojudge.tw/ShowProblem?problemid=r489)
* ポイント：2次元配列シミュレーション (配列回転)
* 解説
    * r = c の場合、回転の辺の長さはすべて同じなので、4方向すべてを回転させます。r ≠ c の場合は、0度と180度だけ回転させます。他の2つはこのような不一致が生じるためです
    * 配列回転の方法を理解していれば、原則的にこの問題は解けます（b を元の配列とします）
        * 右に0度回転 = b 配列
        * 右に90度回転、arr[j][r-i-1] = b[i][j]
        * （残りは何度も90度回転させることで実装）
```CPP
#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> rotate90(vector<vector<int>> mp){
    int R = mp.size();
    int C = mp[0].size();

    vector<vector<int>> res(C, vector<int>(R));

    for(int i = 0; i < R; i++){
        for(int j = 0; j < C; j++){
            res[j][R - 1 - i] = mp[i][j];
        }
    }
    return res;
}

int compare(vector<vector<int>>& A, vector<vector<int>>& B){
    int R = A.size();
    int C = A[0].size();

    int cnt = 0;

    for(int i=0;i<R;i++){
        for(int j=0;j<C;j++){
            if(A[i][j] == B[i][j]) cnt++;
        }
    }

    return cnt;
}

int main(){
    int R, C;
    cin >> R >> C;

    vector<vector<int>> A(R, vector<int>(C));
    vector<vector<int>> B(R, vector<int>(C));

    for(int i=0;i<R;i++)
        for(int j=0;j<C;j++)
            cin >> A[i][j];

    for(int i=0;i<R;i++)
        for(int j=0;j<C;j++)
            cin >> B[i][j];

    int total = R * C;
    int best = 0;

    for(int i=0;i<4;i++){

        if(B.size() == A.size() && B[0].size() == A[0].size()){
            best = max(best, compare(A, B));
        }

        B = rotate90(B);
    }

    cout << (best * 100 / total) << "%\n";
}
```
## 問題3：商品パッケージング [（問題説明）](https://zerojudge.tw/ShowProblem?problemid=r490)
* ポイント：文字列
* 解説
    * 簡潔に言えば、この問題は奇数位置の数字の合計 + 3 × 偶数位置の数字の合計が 10 の倍数であるかを判定します
    * チェックコード c について特別に判定する必要はありません。ちょうど奇数位置にあるため、直接加算するだけです
    * バーコードが有効な場合は、これを保存し、最初の3桁の出現回数を統計します。以下は2つの方法です
        * 最初の3桁を整数で取得します int a = (s[0] - '0'), b = (s[1] - '0'), c = (s[2] - '0')、その数字は a * 100 + b * 10 + c となり、cnt 配列に保存します。最後の出力時には 0 を補充することを忘れずに（例1を参照）
        * 最初の3桁を直接インデックスとして使用し、map <string, int> mp を使用します
```CPP
#include <bits/stdc++.h>
using namespace std;

int main(){
    int n;
    cin >> n;
    string key;
    map<string,int> cnt;
    for(int i=0;i<n;i++){
        int so=0,se=0;
        cin >> key;
        for(int j=0;j<12;j++){
            int v = key[j] - '0';

            if(j % 2 == 0) so += v;
            else se += v;
        }
        int x = (so + 3 * se) % 10;
        int check = key[12] - '0';

        if( (x + check) % 10 == 0 ){
            cnt[key.substr(0,3)]++;
        }
    }
    string ans;
    int mx = 0;

    for(auto &p : cnt){
        if(p.second > mx){
            mx = p.second;
            ans = p.first;
        }
    }

    cout << ans << " " << mx << "\n";
}
```

---
title: APCS October 2025 Intermediate Solutions
date: 2026-06-04
categories:
  - Technical Sharing
cover: /images/save.webp
tags:
  - APCS
urlname: APCS202510
lang: en
---
## Problem 1: Comet Impact [（Problem Statement）](https://zerojudge.tw/ShowProblem?problemid=r488)
* Key Concept: 2D Array Simulation (Region Value Change & Boundary Detection)
* Solution
    * The main task is to detect whether there are any dinosaurs within a radius s centered at (a, b). If there are none, reduce each point by d
    * Create an array to record how many dinosaurs are at each position
    * When traversing the affected area, we can see that the left boundary is b - s/2 and the top boundary is a - s/2. So we can traverse from the top-left corner (a - s/2, b - s/2) in an s × s matrix (remember to check boundaries)
    * If there are dinosaurs (dino[i][j] > 0), first subtract dino[i][j] from the count of awake dinosaurs, then set dino[i][j] to 0. Otherwise, subtract d from everything

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

## Problem 2: Aerial Photography [（Problem Statement）](https://zerojudge.tw/ShowProblem?problemid=r489)
* Key Concept: 2D Array Simulation (Array Rotation)
* Solution
    * If r = c, the dimensions after rotation are the same, so we need to try all 4 rotations. If r ≠ c, we only need to try 0 and 180 degrees because the other two rotations would have different dimensions
    * If you understand array rotation, you can solve this problem (let b be the original array)
        * Rotate right 0 degrees = array b
        * Rotate right 90 degrees: arr[j][r-i-1] = b[i][j]
        * (For the rest, apply 90-degree rotations multiple times)
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
## Problem 3: Product Packaging [（Problem Statement）](https://zerojudge.tw/ShowProblem?problemid=r490)
* Key Concept: String Processing
* Solution
    * Simply put, this problem checks if the sum of digits at odd positions + 3 × (sum of digits at even positions) is a multiple of 10
    * You don't need to specially validate the check digit c, since it's at an odd position anyway, just include it in the sum
    * If the barcode is valid, store it and count the occurrences of the first three digits. Here are two approaches
        * Get the first three digits as an integer: int a = (s[0] - '0'), b = (s[1] - '0'), c = (s[2] - '0'), the value is a * 100 + b * 10 + c, store it in cnt array, and remember to pad with zeros in the output (see Example 1)
        * Use the first three digits directly as the key, using map <string, int> mp
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

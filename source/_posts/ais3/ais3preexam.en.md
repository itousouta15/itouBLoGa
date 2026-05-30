---
title: AIS3 pre-exam 2025
date: 2025-07-11 13:32:32
tags:
  - AIS3
cover: /images/ais3/ais3.webp
urlname: AIS3PE
lang: en
---
# Foreword

This was my first CTF.
I played very poorly and the writeup is also very bad.
~~For the sake of your eyes, please do not continue reading.~~

# web

## tomorin db

### Problem Observation

First, click on the URL provided by the problem [http://chals1.ais3.org:30000/](http://chals1.ais3.org:30000/):
![](/images/ais3/tomorin.webp)
You can see four files:

  - cute.jpg
  - flag
  - is.jpg
  - tomorin.jpg

Three of them are images, **but clicking on `flag` redirects to [MyGO\!\!\!\!\!'s Yurisenshu](https://www.youtube.com/watch?v=lQuWN0biOBU)** ~~MyGO again~~
![](/images/ais3/MyGO.webp)

### Vulnerability Analysis

Since the flag file does exist, but the `/flag` path is specially handled, we can try to bypass this `/flag` path.

### Bypass Idea

After trying, I found that if we use URL encoding **(%2f)** plus `flag`, it will not be redirected.
So I added ***/%2fflag*** after the root URL.
![](/images/ais3/成功訪問.webp)

We can then get the flag:

```
AIS3{G01ang_H2v3_a_c0O1_way!!!_Us3ing_C0NN3ct_M3Th07_L0l@T0m0r1n_1s_cute_D0_yo7_L0ve_t0MoRIN?}
```

## Login Screen 1

### Page Analysis

After entering the webpage, we see a login interface:
![](/images/ais3/登入畫面.webp)
Including:

  - Username input box
  - Password input box
  - Login button

### Injection Attack
![](/images/ais3/FLAGG.webp)
We then get the FLAG:

```
AIS3{1.Es55y_SQL_1nJ3ct10n_w1th_2fa_IuABDADGeP0}
```

# misc

## Ramen CTF

This was the most interesting problem for me.

### Problem Observation

They gave us an image:
![](/images/ais3/chal.webp)
The only valuable thing in it is the receipt, so I thought about whether I could find some information using the receipt's details.
![](/images/ais3/發票.webp)
We can get the following information:

  - 平和.... (Heihwa....)
  - MF prefix
  - Receipt dated 2025/04/13
  - Random code 7095
  - Seller number 3478592...

Next, using a QR code scanner, we found:
![](/images/ais3/QRcode.webp)
  - Full receipt number MF16879911
  - The meal was shrimp ramen

### Address Search

Enter the above information into the [Ministry of Finance Electronic Invoice Integration Service Platform](https://www.einvoice.nat.gov.tw/portal/btc/audit/btc601w/search)
![](/images/ais3/完整資訊.webp)
We then got the address, and entered the address into Google Maps.
We found a restaurant called **樂山溫泉拉麵 (Leshan Hot Spring Ramen)**

We can then get the Flag:

```
AIS3{樂山溫泉拉麵:蝦拉麵}
```

## AIS3 Tiny Server - Web / Misc

First, click on the URL provided by the problem and after getting the token:
We arrive at http://chals1.ais3.org:20096/index.html
![](/images/ais3/Tiny-server.webp)
I tried adding common hidden paths, and after multiple attempts, I found that **adding `//` can bring up the file directory**.
![](/images/ais3/目錄.webp)
There are many files inside. I clicked on the one with "flag" in the filename: **readable_flag_jkO47trw1ctKlOIFC7smx7hivqoCPL8Y**
![](/images/ais3/FLAG.webp)
We then got the flag:

```
AIS3{tInY_we8_53Rv3R_wi7H_fILe_8R0Ws1nG_AS_@_FeAtURe}
```

## Welcome

### I'll just type it directly owo
![](/images/ais3/welcome.webp)

# crypto

## SlowECDSA

After seeing the problem, I realized this was a classic LCG attack problem. The security of ECDSA relies entirely on the unpredictability of the random number k. If the server uses LCG to generate these random numbers, it's not difficult.

### **Collecting Examples**

Since the server provides the `get_example` function, I called it twice to obtain two different signatures. This allowed me to get a pair of signatures using consecutive LCG random numbers.

### **Mathematical Relationship**

According to Perplexity's data:
The ECDSA signature formula is:
$$s = k^{-1} \times (h + r \times d) \bmod n$$

If k₁ and k₂ have a linear relationship: k₂ = (a × k₁ + c) mod n, then we can construct an equation for d.

## **Solving**

From the relationship between the two signatures, we can derive:
$$s₂^{-1} \times (h + r₂ \times d) \equiv a \times s₁^{-1} \times (h + r₁ \times d) + c \pmod{n}$$

Solving this linear equation gives us d.

### **Prediction**

With the private key, we can deduce the true k₁, and then use the linear property of LCG to predict k₃.

### **Forging Signature**

Using the predicted k₃ and the known private key, generate a completely valid signature for the target message "give\_me\_flag".

### **Attack**

I asked AI to write a Python script to implement this attack:

```python
from pwn import *
from hashlib import sha1
from sage.all import *
import re

# Elliptic curve parameters (secp256k1)
p = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f
a_curve = 0
b_curve = 7
n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141

# LCG parameters
a = 0x5deece66d
c = 0xb

def get_example_signature(conn):
    """Get example signature"""
    conn.sendline(b'1')
    response = conn.recvuntil(b'Choice: ').decode()
    
    # Parse r and s values
    r_match = re.search(r'r=0x([0-9a-f]+)', response)
    s_match = re.search(r's=0x([0-9a-f]+)', response)
    
    if r_match and s_match:
        r = int(r_match.group(1), 16)
        s = int(s_match.group(1), 16)
        print(f"[*] Received example: msg='example_msg', r=0x{r:x}, s=0x{s:x}")
        return {'r': r, 's': s}
    else:
        raise ValueError("Failed to parse signature")

def solve_for_private_key(sig1, sig2, h, n, a, c):
    """Solve for private key"""
    r1, s1 = sig1['r'], sig1['s']
    r2, s2 = sig2['r'], sig2['s']
    
    # Establish linear congruence equation to solve for private key
    # s2^-1 * (h + r2 * d) ≡ a * s1^-1 * (h + r1 * d) + c (mod n)
    
    s1_inv = pow(s1, -1, n)
    s2_inv = pow(s2, -1, n)
    
    # Rearrange the equation
    # s2_inv * h + s2_inv * r2 * d ≡ a * s1_inv * h + a * s1_inv * r1 * d + c (mod n)
    # (s2_inv * r2 - a * s1_inv * r1) * d ≡ a * s1_inv * h - s2_inv * h + c (mod n)
    
    coeff_d = (s2_inv * r2 - a * s1_inv * r1) % n
    rhs = (a * s1_inv * h - s2_inv * h + c) % n
    
    # Solve for d
    coeff_d_inv = pow(coeff_d, -1, n)
    d = (coeff_d_inv * rhs) % n
    
    return d

def predict_next_k(sk, sig1, h, n, a, c):
    """Predict next random number"""
    r1, s1 = sig1['r'], sig1['s']
    
    # Calculate actual k1
    s1_inv = pow(s1, -1, n)
    k1_actual = (s1_inv * (h + r1 * sk)) % n
    print(f"[*] Calculated k1_actual: 0x{k1_actual:x}")
    
    # Calculate k2
    k2_actual = (a * k1_actual + c) % n
    
    # Predict k3
    k3_for_flag = (a * k2_actual + c) % n
    print(f"[*] Predicted k3 for flag signing: 0x{k3_for_flag:x}")
    
    return k3_for_flag

def forge_signature(k, h, sk, G, n):
    """Forge signature"""
    # Calculate r
    point = k * G
    r = point.xy()[0] % n
    
    # Calculate s
    k_inv = pow(k, -1, n)
    s = (k_inv * (h + r * sk)) % n
    
    return r, s

def main():
    # Connect to server
    print("[+] Opening connection to chals1.ais3.org on port 19000: Done")
    conn = remote('chals1.ais3.org', 19000)
    
    # Skip initial message
    conn.recvuntil(b'Choice: ')
    
    # Get first example signature
    print("[*] Getting first example signature...")
    example1 = get_example_signature(conn)
    
    # Get second example signature
    print("[*] Getting second example signature...")
    example2 = get_example_signature(conn)
    
    # Create elliptic curve
    E = EllipticCurve(GF(p), [a_curve, b_curve])
    G = E(0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798,
          0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8)
    
    # Calculate hash of example_msg
    h_ex = int.from_bytes(sha1(b"example_msg").digest(), 'big')
    print(f"[*] h_ex (for 'example_msg') = 0x{h_ex:x}")
    
    # Solve for private key
    sk = solve_for_private_key(example1, example2, h_ex, n, a, c)
    print(f"[+] Recovered private key (sk): 0x{sk:x}")
    
    # Predict next random number
    k3_predicted = predict_next_k(sk, example1, h_ex, n, a, c)
    
    # Calculate hash of give_me_flag
    h_flag = int.from_bytes(sha1(b"give_me_flag").digest(), 'big')
    print(f"[*] h_flag (for 'give_me_flag') = 0x{h_flag:x}")
    
    # Forge signature
    r_flag, s_flag = forge_signature(k3_predicted, h_flag, sk, G, n)
    print(f"[+] Forged signature for 'give_me_flag': r=0x{r_flag:x}, s=0x{s_flag:x}")
    
    # Submit forged signature
    print("[*] Sending forged signature to verify...")
    conn.sendline(b'2')
    conn.sendline(hex(r_flag)[2:].encode())
    conn.sendline(hex(s_flag)[2:].encode())
    
    # Receive response
    print("[*] Server response:")
    response = conn.recvall().decode()
    print(response)
    
    # Close connection
    conn.close()

if __name__ == "__main__":
    main()
```

After execution, we got the Flag:
![](/images/ais3/response.webp)
```
AIS3{Aff1n3_nounc3s_c@N_bE_broke_ezily...}
```

## Stream

According to the Python program provided by the problem, we saw the flaw in this encryption scheme:
**When the plaintext is small relative to the key, the result of the XOR operation is mainly determined by the key.**
So we can use the mathematical relationship to reverse attack.
![](/images/ais3/缺陷.webp)
### **Idea**

Now we know the encryption formula is:

```
encrypted_int = flag_int ⊕ (rand_num²)
```

When flag_int is much smaller than rand_num², we have:

```
encrypted_int ≈ rand_num²
```

Then we can reverse the flag.

### **Attack**

First, we calculate the approximate random number:

```python
approx_rand_num = math.isqrt(encrypted_int)
```

Then search for the offset:

```python
for offset in range(-search_width, search_width + 1):
    rand_num_candidate = approx_rand_num + offset
```

Next, for each candidate random number, calculate its square and try to decrypt:

```python
key_squared = rand_num_candidate ** 2
flag_candidate = encrypted_int ^ key_squared
```

Basic filtering:

```python
# Exclude invalid results
if flag_candidate == 0:
    continue

# Check length reasonableness
num_bits = flag_candidate.bit_length()
byte_len = (num_bits + 7) // 8
if not (5 < byte_len < 80):
    continue
```

Convert to string

```python
def int_to_bytes(n: int) -> bytes:
    if n == 0:
        return b'\x00'
    byte_length = (n.bit_length() + 7) // 8
    return n.to_bytes(byte_length, 'big')

flag_bytes_candidate = int_to_bytes(flag_candidate)
```

Last step, decode

```python
    try:
        potential_flag = flag_bytes_candidate.decode('ascii')
        
        # Check AIS3 format
        if (potential_flag.startswith('AIS3{') and 
            potential_flag.endswith('}') and 
            potential_flag.isprintable()):
            
            print(f"[Success] Found AIS3 flag, offset: {offset}")
            print(f"Candidate rand_num: {hex(rand_num_candidate)}")
            print(f"Flag bytes: {flag_bytes_candidate}")
            print(f"Decryption result: {potential_flag}")
            found_flag = True
            break
            
    except UnicodeDecodeError:
        continue
    except Exception as e:
        print(f"Error processing offset {offset}: {e}")

if not found_flag:
    print(f"\nNo valid flag found within range [{-search_width}, {search_width}]")
    print("Suggest increasing search_width or checking encryption assumptions")
```

After running, we got the flag:
![](/images/ais3/print.webp)
```
AIS3{no_more_junks...plz}
```

## Hill

The system uses two matrices A and B:

  - First block: c₀ = A × m₀

  - Subsequent blocks: cᵢ = A × mᵢ + B × mᵢ₋₁

### **Idea**

(The server only allows one `input()`)
I need a special input sequence to recover both matrices A and B simultaneously. I thought of using standard basis vectors:
`payload = [e₀, 0, e₁, 0, e₂, 0, ..., e₇, 0]`

When the server processes this payload:

  - c₀ = A × e₀ gives the 0th column of A
  - c₁ = A × 0 + B × e₀ gives the 0th column of B
  - c₂ = A × e₁ gives the 1st column of A
  - And so on...

After recovering A and B, calculate the inverse of A, and then decrypt the target FLAG in reverse.

### **Attack**

```python
import numpy as np
from sympy import Matrix
from pwn import *
import re

# Set parameters
HOST = 'chals1.ais3.org'
PORT = 18000
n = 8  # Block size and matrix dimension
p_mod = 251  # Modulus

def parse_block_line(line):
    """Parse a line containing 8 numbers using regular expressions"""
    if isinstance(line, bytes):
        line = line.decode().strip()
    else:
        line = line.strip()
    
    # Use regular expressions to extract all numbers
    nums = re.findall(r'\d+', line)
    if len(nums) == 8:
        return np.array([int(x) for x in nums])
    else:
        return None

def inv_mod(matrix, mod):
    """Calculate the modular inverse of a matrix"""
    A_matrix = Matrix(matrix)
    A_inv = np.array(A_matrix.inv_mod(mod), dtype=int)
    return A_inv

def solve():
    r = remote(HOST, PORT)
    
    try:
        # 1. First read all initial output
        print("[*] Reading all initial output...")
        all_lines = []
        
        try:
            while True:
                line = r.recvline(timeout=2)
                if not line:
                    break
                decoded_line = line.decode().strip()
                all_lines.append(decoded_line)
                print(f"[DEBUG] Received: '{decoded_line}'")
                
                # Stop if input prompt is seen
                if any(keyword in decoded_line.lower() for keyword in ['input', 'enter', 'message']):
                    break
        except EOFError:
            print("[DEBUG] EOF reached")
        
        # 2. Parse target FLAG from all lines
        print("[*] Parsing target flag from received lines...")
        C_target_flag = []
        flag_started = False
        
        for line in all_lines:
            print(f"[DEBUG] Processing line: '{line}'")
            
            # Check if flag area has started
            if "encrypted flag" in line.lower():
                flag_started = True
                continue
            
            # Stop parsing flag if input prompt is encountered
            if any(keyword in line.lower() for keyword in ['input', 'enter', 'message']):
                break
            
            # If in flag area, try to parse numbers
            if flag_started and line.strip():
                block = parse_block_line(line)
                if block is not None:
                    C_target_flag.append(block)
                    print(f"[DEBUG] Parsed flag block {len(C_target_flag)}: {list(block)}")
        
        print(f"[*] Target flag has {len(C_target_flag)} blocks")
        
        if len(C_target_flag) == 0:
            print("[ERROR] Failed to parse target flag")
            return
        
        # 3. Construct payload M_payload
        print("[*] Constructing payload...")
        M_payload_blocks = []
        for i in range(n):
            e_i = np.zeros(n, dtype=int)
            e_i[i] = 1
            M_payload_blocks.append(e_i)  # p_{2i} = e_i
            M_payload_blocks.append(np.zeros(n, dtype=int))  # p_{2i+1} = 0
        
        payload_bytes_list = []
        for block in M_payload_blocks:
            payload_bytes_list.extend(list(block))
        final_payload = bytes(payload_bytes_list)
        
        print(f"[DEBUG] Payload length: {len(final_payload)} bytes")
        
        # 4. Send payload
        print("[*] Sending payload...")
        r.sendline(final_payload)
        
        # 5. Receive 2n ciphertext blocks (C_response)
        print("[*] Receiving response blocks...")
        C_response = []
        
        try:
            while len(C_response) < 2 * n:
                line = r.recvline(timeout=3)
                if not line:
                    break
                
                decoded_line = line.decode().strip()
                print(f"[DEBUG] Response line: '{decoded_line}'")
                
                if not decoded_line:
                    continue
                
                block = parse_block_line(decoded_line)
                if block is not None:
                    C_response.append(block)
                    print(f"[DEBUG] Received response block {len(C_response)}: {list(block)}")
                    
        except EOFError:
            print("[DEBUG] EOF while receiving response")
        
        if len(C_response) < 2 * n:
            print(f"[ERROR] Expected {2*n} response blocks, got {len(C_response)}")
            return
        
        # 6. Extract A and B from C_response
        print("[*] Recovering matrices A and B...")
        A_recovered_cols = []
        B_recovered_cols = []
        
        for i in range(n):
            A_recovered_cols.append(C_response[2*i])
            B_recovered_cols.append(C_response[2*i+1])
        
        A_recovered = np.array(A_recovered_cols).T % p_mod
        B_recovered = np.array(B_recovered_cols).T % p_mod
        
        print("[*] Recovered matrix A:")
        print(A_recovered)
        
        # 7. Calculate modular inverse of A
        print("[*] Calculating inverse of A...")
        A_inv = inv_mod(A_recovered, p_mod)
        print("[+] Calculated A_inv successfully")
        
        # 8. Decrypt C_target_flag
        print(f"[*] Decrypting {len(C_target_flag)} target flag blocks...")
        decrypted_blocks_list = []
        
        # Decrypt first block
        block_0 = (A_inv @ C_target_flag[0]) % p_mod
        decrypted_blocks_list.append(block_0)
        print(f"[DEBUG] Decrypted target flag block 0: {list(block_0)}")
        
        # Loop to decrypt subsequent blocks
        for i in range(1, len(C_target_flag)):
            temp = (C_target_flag[i] - B_recovered @ decrypted_blocks_list[i-1] + p_mod) % p_mod
            block_i = (A_inv @ temp) % p_mod
            decrypted_blocks_list.append(block_i)
            print(f"[DEBUG] Decrypted target flag block {i}: {list(block_i)}")
        
        # 9. Assemble FLAG string
        flag_bytes = b"".join(bytes(list(block_array)) for block_array in decrypted_blocks_list)
        flag_str = flag_bytes.decode('utf-8', errors='ignore').rstrip('\x00')
        
        print(f"[+] Decrypting all target flag blocks.")
        print(f"[+] FLAG: {flag_str}")
        
    except Exception as e:
        print(f"[ERROR] Attack failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        r.close()

# Main program entry
if __name__ == "__main__":
    solve()
```

After execution, we got:
![](/images/ais3/FLAGGG.webp)
FLAG:
`AIS3{b451c_h1ll_c1ph3r_15_2_3z_f0r_u5}`

## Happy Happy Factoring

This is a classic multi-algorithm combination attack:

  - wi: Williams' p+1 algorithm
  - po: Pollard's p-1 algorithm
  - fp, fq: Fermat's factorization method

First, use Pollard's p-1 to find `po`, remove `po²`, then use Williams' p+1 to find `wi`, and finally use Fermat's method to factor the remaining part.

After obtaining all factors, calculate Euler's totient function and decrypt.

```python
import gmpy2
from collections import Counter

def read_input(filename="output.txt"):
    with open(filename, "r") as f:
        lines = f.read().strip().splitlines()
        n = int(lines[0].split(" = ")[1])
        e = int(lines[1].split(" = ")[1])
        c = int(lines[2].split(" = ")[1])
        return n, e, c

def generate_prime_list():
    return [p for p in range(3, 5000) if gmpy2.is_prime(p)]

def pollard_p_minus_1(n, prime_list):
    a = gmpy2.mpz(2)
    for _ in range(86):
        a = gmpy2.powmod(a, 2, n)
    for p in prime_list:
        for _ in range(85):
            a = gmpy2.powmod(a, p, n)
    return gmpy2.gcd(a - 1, n)

def extract_factor(gcd_val, n, expected_power=1):
    if gcd_val in [1, n]: return None
    if gmpy2.is_prime(gcd_val): return int(gcd_val)
    temp = gcd_val
    factors = []
    for p in [2] + generate_prime_list():
        while temp % p == 0:
            factors.append(p)
            temp //= p
        if temp == 1:
            break
    if temp > 1 and gmpy2.is_prime(temp): factors.append(int(temp))
    counts = Counter(factors)
    for f, count in counts.items():
        if count >= expected_power and gmpy2.is_prime(f):
            return f
    return None

def lucas_V(k, P, N):
    if k == 0: return 2
    if k == 1: return P
    V0, V1 = 2, P
    for bit in bin(k)[3:]:
        if bit == "0":
            V1 = (V0 * V1 - P) % N
            V0 = (V0 * V0 - 2) % N
        else:
            V0 = (V0 * V1 - P) % N
            V1 = (V1 * V1 - 2) % N
    return V1

def williams_p_plus_1(n, prime_list, P=3):
    V = P
    for _ in range(86):
        V = lucas_V(2, V, n)
    for p in prime_list:
        for _ in range(85):
            V = lucas_V(p, V, n)
    return gmpy2.gcd(V - 2, n)

def fermat(n, max_iter=200_000_000):
    a = gmpy2.isqrt(n) + 1
    for i in range(max_iter):
        b2 = a * a - n
        b = gmpy2.isqrt(b2)
        if b * b == b2:
            return int(a + b), int(a - b)
        if i % 1_000_000 == 0 and i > 0:
            print(f"     [Fermat] Attempt {i:,} times...")
        a += 1
    return None, None

def rsa_decrypt(n, e, c, po, wi, fp, fq):
    phi = po * (po - 1) * (wi - 1) * (fp - 1) * (fq - 1)
    d = gmpy2.invert(e, phi)
    m = gmpy2.powmod(c, d, n)
    flag = int(m).to_bytes((m.bit_length() + 7) // 8, 'big').decode()
    return phi, d, m, flag

def main():
    print("[*] Reading RSA public parameters")
    n, e, c = read_input()
    primes = generate_prime_list()

    print("[*] Step 1: Pollard p-1")
    g = pollard_p_minus_1(n, primes)
    po = extract_factor(g, n, expected_power=2)
    if not po: raise Exception("Could not find po")
    n1 = n // (po * po)

    print("[*] Step 2: Williams p+1 or fallback")
    wi = None
    for base in [3, 5, 7, 11, 13, 17, 19, 23]:
        g = williams_p_plus_1(n1, primes, base)
        candidate = extract_factor(g, n1)
        if candidate and gmpy2.is_prime(candidate):
            wi = candidate
            break
    if not wi:
        print("[!] Williams p+1 failed, falling back to Fermat")
        f1, f2 = fermat(n1)
        if f1 and gmpy2.is_prime(f1):
            wi, n2 = f1, f2
        elif f2 and gmpy2.is_prime(f2):
            wi, n2 = f2, f1
        else:
            raise Exception("Could not find wi")
    else:
        n2 = n1 // wi

    print("[*] Step 3: Fermat factorization for fp, fq")
    fp, fq = fermat(n2)
    if fp < fq:
        fp, fq = fq, fp

    print("[*] Step 4: RSA Decryption")
    phi, d, m, flag = rsa_decrypt(n, e, c, po, wi, fp, fq)

    print("\n🎉 Decryption successful! Here are the details:")
    print("\nFactors found:")
    print(f"po = {po}")
    print(f"wi = {wi}")
    print(f"fp = {fp}")
    print(f"fq = {fq}\n")
    print(f"phi_n = {phi}\n")
    print(f"d = {d}")
    print(f"m = {m}")
    print(f"\n🚩 Flag: {flag}")

if __name__ == "__main__":
    main()
```
![](/images/ais3/結果.webp)
We then got the FLAG:
`AIS3{H@ppY_#ap9y_CRypT0_F4(7or1n&~~~}`

# Conclusion

I'm glad you made it this far without going blind.
But there's nothing left below, so see you next time(?)
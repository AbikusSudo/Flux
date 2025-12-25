# Guide: How to Update Any VPN Subscription When CIDR* is Active

Hello everyone! Today, I’ll show you a simple method using TurboPages. This method maked for Russia.

---

## Steps

1. Open [this link](https://translate.yandex.ru/?source_lang=en&target_lang=en&text=https%3A%2F%2Fexample.com)  
> **Note:** This link works even if CIDR is active. Replace `example.com` with your subscription URL.

2. Click **"Перевести страницу" (Translate Page)** to generate a TurboPages link. It will look like this:  
```
https://translated.turbopages.org/proxy_u/en-en.ru.(your_session_ID)/https/example.com
```  
> Keep your session ID private!!!

3. Use the generated link as your **Subscription Link** instead of the direct URL.  

> Enjoy!

---

## FAQ

**1. TurboPages shows "limited" text**  
- This happens if you reused the URL incorrectly. Make sure to generate a new TurboPages link following Step 2.  

**2. TurboPages returns "Не удалось перевести страницу" (Cannot translate page)**  
- The URL did not return a valid HTTP response (200 OK). Wait until CIDR is off or check the URL later.  
- You can also test in a browser and inspect the HTML code. For example, try translating [this test URL](https://www.gstatic.com/generate_204).  

> Example Error:
```
DownloaderResponseError.NoContent
Message: The response body is empty
```  
-  Messages are dynamic, it can return anything. watch out.

**3. Is it safe?**  
- Yes, this method is completely safe. Just RKN doesnt like that, but we dont care, right? xD

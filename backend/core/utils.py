def format_phn_number(phone: str) -> str:
    phone = phone.strip()
    phone = phone.replace(" ", "")

    if phone.startswith("+"):
        return phone
    
    if phone.startswith("0"):
        phone = phone[1:]

    return "+91" + phone

from hashlib import sha512

def hash_password(password, salt = "12stulyev"):
    hasher = sha512()
    hasher.update((password + salt).encode())
    return hasher.hexdigest()
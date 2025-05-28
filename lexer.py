def analizar_lexico(code):
    palabras_clave = {"if", "else", "while", "for", "return"}
    simbolos_validos = {"(", ")", "{", "}", "+", "-", "*", "/", "="}
    simbolos_error = {";", ":"}
    tokens = []

    palabras = code.replace('\n', ' ').split()

    for palabra in palabras:
        if palabra in palabras_clave:
            tokens.append(f"Palabra clave: {palabra}")
        elif palabra in simbolos_error:
            tokens.append(f"Error: símbolo no permitido '{palabra}'")
        elif palabra.isdigit():
            tokens.append(f"Número: {palabra}")
        elif palabra in simbolos_validos:
            tokens.append(f"Símbolo: {palabra}")
        else:
            tokens.append(f"Identificador: {palabra}")

    return '\n'.join(tokens)
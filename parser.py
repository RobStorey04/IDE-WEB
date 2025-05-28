def analizar_sintactico(code):
    lineas = code.strip().split('\n')
    errores = []

    palabras_clave = ("if", "while", "for", "def", "else", "elif")

    for i, linea in enumerate(lineas, start=1):
        # Encontrar la posición del comentario si existe
        posicion_comentario = linea.find('#')
        linea_original = linea
        
        # Si hay comentario, solo analizar hasta ese punto
        if posicion_comentario != -1:
            linea = linea[:posicion_comentario]
        
        linea = linea.strip()
        if not linea:  # Si la línea está vacía o era solo un comentario
            continue

        if ";" in linea:
            errores.append({
                "linea": i,
                "mensaje": "No se permite el uso de ';'",
                "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
            })
            continue
        if ":" in linea:
            errores.append({
                "linea": i,
                "mensaje": "No se permite el uso de ':'",
                "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
            })
            continue

        if any(linea.startswith(clave) for clave in palabras_clave):
            errores.append({
                "linea": i,
                "mensaje": f"Uso no permitido de estructura: {linea.split()[0]}",
                "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
            })
            continue

        if "=" in linea:
            partes = linea.split("=")
            if len(partes) != 2:
                errores.append({
                    "linea": i,
                    "mensaje": "Asignación inválida: debe tener una sola '='",
                    "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
                })
                continue
            izquierda = partes[0].strip()
            derecha = partes[1].strip()
            if not izquierda.isidentifier():
                errores.append({
                    "linea": i,
                    "mensaje": f"Nombre inválido para variable: '{izquierda}'",
                    "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
                })
                continue
            if not derecha:
                errores.append({
                    "linea": i,
                    "mensaje": "Valor de asignación faltante",
                    "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
                })
                continue
        else:
            errores.append({
                "linea": i,
                "mensaje": "Línea inválida: falta operador de asignación '='",
                "fin_codigo": posicion_comentario if posicion_comentario != -1 else len(linea_original)
            })
            continue

    if errores:
        mensaje = f"Errores sintácticos encontrados: {len(errores)} línea(s) con problemas."
    else:
        mensaje = "Análisis sintáctico correcto ✅"

    return {
        "resultado": mensaje,
        "errores": errores
    }
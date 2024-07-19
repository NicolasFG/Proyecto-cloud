from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS


app = Flask(__name__)

CORS(app)  # Habilita CORS para toda la aplicación

# Cargar modelo
with open('modelo_precargado.pkl', 'rb') as f:
    df_filtrado, perfil_usuario, usuarios_similares_precalculados = pickle.load(f)

print("Modelo precargado cargado correctamente.")

def categorias_mas_consumidas(cod_cliente, df_filtrado):
    compras_usuario = df_filtrado[df_filtrado['CodCliente'] == cod_cliente]
    frecuencia_categorias = compras_usuario['Categoria'].value_counts()
    return frecuencia_categorias

def cargar_usuarios_similares_y_recomendar(cod_cliente, df_filtrado, num_recomendaciones=5):
    usuarios_similares = usuarios_similares_precalculados.get(cod_cliente, [])
    print(f"Usuarios similares para el cliente {cod_cliente}: {usuarios_similares}")

    if not usuarios_similares:
        print(f"No se encontraron usuarios similares para el cliente {cod_cliente}")
        return []

    usuarios_que_influyen = []

    productos_recomendados = pd.DataFrame()
    for usuario in usuarios_similares:
        productos_usuario = df_filtrado[df_filtrado['CodCliente'] == usuario][['Categoria', 'descripcion', 'ImporteLinea']]
        if not productos_usuario.empty:
            usuarios_que_influyen.append(usuario)
            productos_recomendados = pd.concat([productos_recomendados, productos_usuario])

    print("Usuarios que influyen:", usuarios_que_influyen)
    print("Productos recomendados antes de agrupar:")
    print(productos_recomendados.head())

    if 'Categoria' in productos_recomendados.columns:
        recomendaciones = productos_recomendados.groupby('Categoria')['ImporteLinea'].sum().sort_values(ascending=False).head(num_recomendaciones)
        return recomendaciones.index.tolist()
    else:
        print("La columna 'Categoria' no se encontró en productos_recomendados")
        return []

@app.route('/recomendar', methods=['POST'])
def recomendar():
    data = request.get_json()
    
    # Imprimimos el JSON recibido para depuración
    print(f"JSON recibido: {data}")
    
    cod_cliente = data.get('cod_cliente')
    
    # Validación adicional para asegurar que se recibe el código de cliente
    if not cod_cliente:
        return jsonify({
            'mensaje': 'Código de cliente no proporcionado en la solicitud'
        })
    
    # Filtramos el dataframe para obtener los datos del cliente especificado
    df_cliente = df_filtrado[df_filtrado['CodCliente'] == cod_cliente]
    
    # Si no se encuentra el cliente, devolvemos un mensaje
    if df_cliente.empty:
        return jsonify({
            'mensaje': f'No se encontraron datos para el cliente {cod_cliente}'
        })
    
    # Implementar la lógica para encontrar usuarios similares
    categorias_cliente = df_cliente['Categoria'].unique()
    subcategorias_cliente = df_cliente['Subcategoria'].unique()
    
    usuarios_similares = df_filtrado[
        (df_filtrado['Categoria'].isin(categorias_cliente)) & 
        (df_filtrado['Subcategoria'].isin(subcategorias_cliente)) & 
        (df_filtrado['CodCliente'] != cod_cliente)
    ]['CodCliente'].unique().tolist()
    
    # Si no se encuentran usuarios similares
    if not usuarios_similares:
        return jsonify({
            'mensaje': f'No se encontraron usuarios similares para el cliente {cod_cliente}'
        })
    
    # Obtener productos comprados por los usuarios similares
    df_usuarios_similares = df_filtrado[df_filtrado['CodCliente'].isin(usuarios_similares)]
    
    # Contar la frecuencia de cada producto comprado por los usuarios similares
    productos_recomendados = df_usuarios_similares['descripcion'].value_counts().head(10).index.tolist()
    
    return jsonify({
        'Productos recomendados para el cliente': productos_recomendados
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

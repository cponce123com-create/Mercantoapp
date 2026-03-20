from PIL import Image
import os

def process_images():
    logo_path = "/home/ubuntu/Mercantoapp/logo_mercanto_transparent.png"
    favicon_path = "/home/ubuntu/Mercantoapp/favicon.png"
    output_dir = "/home/ubuntu/Mercantoapp/artifacts/mercanto/public"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Procesar el logo para la aplicación
    with Image.open(logo_path) as img:
        # Redimensionar para diferentes usos si es necesario, pero por ahora guardarlo en public
        img.save(os.path.join(output_dir, "logo.png"))
        print(f"Logo guardado en {os.path.join(output_dir, 'logo.png')}")

    # Procesar el favicon
    with Image.open(favicon_path) as img:
        # Crear favicon.ico con múltiples tamaños
        img.save(os.path.join(output_dir, "favicon.ico"), format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"Favicon guardado en {os.path.join(output_dir, 'favicon.ico')}")

if __name__ == "__main__":
    process_images()

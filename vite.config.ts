import glsl from 'vite-plugin-glsl'
import restart from 'vite-plugin-restart'

export default (
    {
        root: './',
        publicDir: 'public/',
        build:
        {
            outDir: 'dist', 
            emptyOutDir: true, 
            sourcemap: false, 
            target: 'esnext'
        },
        plugins: [
            restart(
                {
                    restart: ['public/**']
                }
            ),
            glsl(),
        ]
    }
)
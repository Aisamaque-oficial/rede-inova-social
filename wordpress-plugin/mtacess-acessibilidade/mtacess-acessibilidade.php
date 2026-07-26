<?php
/**
 * Plugin Name: MTacess - Acessibilidade Universal
 * Plugin URI: https://mtacess.com.br
 * Description: Plugin de acessibilidade universal com ferramentas de libras, contraste, lupa e muito mais.
 * Version: 1.0.0
 * Author: MTacess
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Inclui a página de administração
require_once plugin_dir_path( __FILE__ ) . 'admin-page.php';

// Enfileira o script do Widget no Frontend
add_action( 'wp_enqueue_scripts', 'mtacess_enqueue_scripts' );
function mtacess_enqueue_scripts() {
    // Carrega o script gerado pelo React
    wp_enqueue_script( 'mtacess-widget-js', plugin_dir_url( __FILE__ ) . 'assets/acessibilidade.js', array(), '1.0.0', true );
}

// Injeta a tag personalizada no Footer
add_action( 'wp_footer', 'mtacess_inject_widget' );
function mtacess_inject_widget() {
    $license = get_option( 'mtacess_license_key', '' );
    $color = get_option( 'mtacess_primary_color', '#059669' );
    $position = get_option( 'mtacess_position', 'direita' );

    // Se houver uma lógica de validação de licença, ela pode bloquear a renderização aqui.
    // Para fins de demonstração, vamos renderizar se a licença não estiver vazia.
    if ( empty( $license ) ) {
        echo '<!-- MTacess: Licença não configurada -->';
        return;
    }
    echo sprintf(
        '<mt-acessibilidade cor-principal="%s" posicao="%s"></mt-acessibilidade>',
        esc_attr( $color ),
        esc_attr( $position )
    );
}

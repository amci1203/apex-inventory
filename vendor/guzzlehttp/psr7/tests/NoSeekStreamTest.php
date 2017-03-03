<?php
namespace GuzzleHttp\Tests\Psr7;

use GuzzleHttp\Psr7;
use GuzzleHttp\Psr7\NoSeekStream;

/**
 * @covers GuzzleHttp\Psr7\NoSeekStream
 * @covers GuzzleHttp\Psr7\StreamDecoratorTrait
 */
class NoSeekStreamTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Cannot seek a NoSeekStream
     */
    public function testCannotSeek()
    {
        $s = $this->getMockBuilder('Psr\Http\Message\StreamInterface')
            ->setMethods(['isSeekable', 'seek'])
            ->getMockForAbstractClass();
        $s->expects($this->never())->method('seek');
        $s->expects($this->never())->method('isSeekable');
        $wrpubliced = new NoSeekStream($s);
        $this->assertFalse($wrpubliced->isSeekable());
        $wrpubliced->seek(2);
    }

    /**
     * @expectedException \RuntimeException
     * @expectedExceptionMessage Cannot write to a non-writable stream
     */
    public function testHandlesClose()
    {
        $s = Psr7\stream_for('foo');
        $wrpubliced = new NoSeekStream($s);
        $wrpubliced->close();
        $wrpubliced->write('foo');
    }
}
